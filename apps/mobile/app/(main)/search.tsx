import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import type { ProductSearchResult } from "@ai-recipes/shared";
import { searchProducts } from "@/api/products";
import { ProductCard } from "@/components/products/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { SentryErrorBoundary } from "@/components/sentry-error-boundary";

function SearchScreenContent() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  const handleSearch = async (searchQuery: string, pageNum: number = 1) => {
    if (searchQuery.trim().length < 2) {
      setProducts([]);
      setError(null);
      return;
    }

    console.log(`[Search] Searching for "${searchQuery}" (page ${pageNum})`);

    try {
      setLoading(true);
      setError(null);

      const response = await searchProducts(searchQuery.trim(), pageNum);

      console.log(
        `[Search] Found ${response.products.length} products (${response.count} total)`
      );

      if (pageNum === 1) {
        setProducts(response.products);
      } else {
        setProducts((prev) => [...prev, ...response.products]);
      }

      setTotalCount(response.count);
      setPage(pageNum);
      setHasMore(response.products.length > 0);
    } catch (err: any) {
      console.error(`[Search] Search failed for "${searchQuery}":`, err.message);

      if (err.status === 0) {
        setError("Check your internet connection");
      } else if (err.status >= 500) {
        setError("Server error. Try again later.");
      } else {
        setError(err.message || "Failed to search products");
      }

      if (pageNum === 1) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new debounced search
    const timeout = setTimeout(() => {
      handleSearch(text, 1);
    }, 300);

    setSearchTimeout(timeout);
  };

  const handleClearSearch = () => {
    setQuery("");
    setProducts([]);
    setError(null);
    setPage(1);
    setHasMore(true);
  };

  const handleProductSelect = (barcode: string) => {
    console.log(`[Search] Product selected: ${barcode}`);
    Keyboard.dismiss();
    router.push({
      pathname: "/(main)/analysis",
      params: { barcode },
    });
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && products.length > 0) {
      handleSearch(query, page + 1);
    }
  };

  const handleRefresh = async () => {
    if (query.trim().length >= 2) {
      await handleSearch(query, 1);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const renderEmpty = () => {
    if (loading) return null;
    if (error) return null;

    return <EmptyState query={query} onClear={handleClearSearch} />;
  };

  const renderFooter = () => {
    if (!loading || products.length === 0) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a product..."
            value={query}
            onChangeText={handleQueryChange}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Text
              style={styles.clearIcon}
              onPress={handleClearSearch}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              ✕
            </Text>
          )}
        </View>

        {products.length > 0 && (
          <Text style={styles.resultsCount}>
            {totalCount} product{totalCount !== 1 ? "s" : ""} found
          </Text>
        )}
      </View>

      {/* Loading State (initial search) */}
      {loading && products.length === 0 && !error && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching products...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <ErrorState error={error} onRetry={() => handleSearch(query, 1)} />
      )}

      {/* Results List */}
      {!error && (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={handleProductSelect} />
          )}
          keyExtractor={(item) => item.barcode}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={false}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearIcon: {
    fontSize: 18,
    color: "#999",
    padding: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    padding: 20,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default function SearchScreen() {
  return (
    <SentryErrorBoundary>
      <SearchScreenContent />
    </SentryErrorBoundary>
  );
}
