/**
 * TypeScript type definitions for Open Food Facts database
 *
 * Based on analysis of openfoodfacts-products.jsonl export
 * Source: https://world.openfoodfacts.org/data
 *
 * Note: Almost all fields are optional due to high variability in crowdsourced data
 */

// ============================================================================
// Core Product Types
// ============================================================================

/**
 * Main product interface representing a single product from Open Food Facts
 */
export interface OpenFoodFactsProduct {
  // Core identifiers
  _id?: string;
  code?: string; // Barcode (EAN-13 or internal)
  id?: string;

  // Basic product information
  product_name?: string;
  product_name_en?: string;
  product_name_fr?: string;
  product_name_es?: string;
  product_name_de?: string;
  product_name_it?: string;
  generic_name?: string;
  generic_name_en?: string;
  generic_name_fr?: string;

  // Brands and manufacturers
  brands?: string;
  brands_tags?: string[];
  brand_owner?: string;
  brand_owner_imported?: string;

  // Quantity and packaging
  quantity?: string;
  product_quantity?: number;
  product_quantity_unit?: string;
  serving_size?: string;
  serving_size_imported?: string;
  serving_quantity?: number;
  serving_quantity_unit?: string;

  // Categories
  categories?: string;
  categories_old?: string;
  categories_imported?: string;
  categories_tags?: string[];
  categories_hierarchy?: string[];
  categories_lc?: string;
  categories_properties?: Record<string, any>;
  categories_properties_tags?: string[];

  // Ingredients
  ingredients?: Ingredient[];
  ingredients_text?: string;
  ingredients_text_en?: string;
  ingredients_text_fr?: string;
  ingredients_text_es?: string;
  ingredients_text_de?: string;
  ingredients_text_debug?: string;
  ingredients_text_with_allergens?: string;
  ingredients_text_with_allergens_en?: string;
  ingredients_text_with_allergens_fr?: string;
  ingredients_tags?: string[];
  ingredients_hierarchy?: string[];
  ingredients_original_tags?: string[];
  ingredients_n?: number;
  ingredients_n_tags?: string[];

  // Ingredients analysis
  ingredients_analysis?: Record<string, any>;
  ingredients_analysis_tags?: string[];
  ingredients_with_specified_percent_n?: number;
  ingredients_with_specified_percent_sum?: number;
  ingredients_with_unspecified_percent_n?: number;
  ingredients_with_unspecified_percent_sum?: number;
  ingredients_percent_analysis?: number;

  // Palm oil
  ingredients_from_palm_oil_n?: number;
  ingredients_from_palm_oil_tags?: string[];
  ingredients_from_or_that_may_be_from_palm_oil_n?: number;
  ingredients_that_may_be_from_palm_oil_n?: number;
  ingredients_that_may_be_from_palm_oil_tags?: string[];

  // Allergens and traces
  allergens?: string;
  allergens_from_ingredients?: string;
  allergens_from_user?: string;
  allergens_tags?: string[];
  allergens_hierarchy?: string[];
  allergens_lc?: string;
  traces?: string;
  traces_from_ingredients?: string;
  traces_from_user?: string;
  traces_tags?: string[];
  traces_hierarchy?: string[];
  traces_lc?: string;

  // Additives
  additives_n?: number;
  additives_tags?: string[];
  additives_original_tags?: string[];

  // Nutritional information
  nutriments?: Nutriments;
  nutriments_estimated?: Nutriments;
  nutrition_data?: string;
  nutrition_data_per?: string;
  nutrition_data_prepared?: string;
  nutrition_data_prepared_per?: string;
  nutrition_data_per_imported?: string;
  nutrition_data_prepared_per_imported?: string;

  // Nutrient levels (high, medium, low)
  nutrient_levels?: NutrientLevels;
  nutrient_levels_tags?: string[];

  // Nutrition scores and grades
  nutrition_grades?: string;
  nutrition_grades_tags?: string[];
  nutrition_grade_fr?: string;
  nutrition_score_debug?: string;
  nutrition_score_beverage?: number;
  nutrition_score_warning_fruits_vegetables_legumes_estimate?: number;
  nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients?: number;
  nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients_value?: number;
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients?: number;
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value?: number;
  nutrition_score_warning_no_fiber?: number;

  // Nutri-Score
  nutriscore?: NutriScore;
  nutriscore_version?: string;
  nutriscore_grade?: string;
  nutriscore_score?: number;
  nutriscore_score_opposite?: number;
  nutriscore_tags?: string[];
  nutriscore_2021_tags?: string[];
  nutriscore_2023_tags?: string[];
  nutriscore_data?: NutriScoreData;

  // NOVA classification
  nova_group?: number;
  nova_group_debug?: string;
  nova_groups?: string;
  nova_groups_tags?: string[];
  nova_groups_markers?: Record<string, any>;

  // Eco-Score
  ecoscore_grade?: string;
  ecoscore_score?: number;
  ecoscore_tags?: string[];
  ecoscore_data?: EcoScoreData;

  // Environmental score (legacy)
  environmental_score_data?: EnvironmentalScoreData;
  environmental_score_grade?: string;
  environmental_score_score?: number;
  environmental_score_tags?: string[];

  // Packaging information
  packaging?: string;
  packaging_old?: string;
  packaging_text?: string;
  packaging_text_en?: string;
  packaging_text_fr?: string;
  packaging_tags?: string[];
  packaging_hierarchy?: string[];
  packaging_lc?: string;
  packaging_materials_tags?: string[];
  packaging_shapes_tags?: string[];
  packaging_recycling_tags?: string[];
  packagings?: Packaging[];
  packagings_complete?: number;
  packagings_materials?: Record<string, any>;
  packagings_n?: number;

  // Origins and locations
  origins?: string;
  origins_old?: string;
  origins_tags?: string[];
  origins_hierarchy?: string[];
  origins_lc?: string;
  origin?: string;
  origin_en?: string;
  origin_fr?: string;
  manufacturing_places?: string;
  manufacturing_places_tags?: string[];
  emb_codes?: string;
  emb_codes_orig?: string;
  emb_codes_tags?: string[];

  // Countries
  countries?: string;
  countries_imported?: string;
  countries_tags?: string[];
  countries_hierarchy?: string[];
  countries_lc?: string;
  countries_debug_tags?: string[];
  added_countries_tags?: string[];
  removed_countries_tags?: string[];

  // Labels and certifications
  labels?: string;
  labels_old?: string;
  labels_tags?: string[];
  labels_hierarchy?: string[];
  labels_lc?: string;

  // Purchase information
  stores?: string;
  stores_tags?: string[];
  purchase_places?: string;
  purchase_places_tags?: string[];

  // Images
  images?: ProductImages;
  image_url?: string;
  image_front_url?: string;
  image_ingredients_url?: string;
  image_nutrition_url?: string;
  image_packaging_url?: string;
  max_imgid?: string;
  last_image_t?: number;
  last_image_dates_tags?: string[];

  // Languages
  lang?: string;
  lc?: string;
  lc_imported?: string;
  languages?: Record<string, number>;
  languages_codes?: Record<string, number>;
  languages_tags?: string[];
  languages_hierarchy?: string[];

  // Timestamps and versioning
  created_t?: number;
  last_modified_t?: number;
  last_updated_t?: number;
  last_edit_dates_tags?: string[];
  entry_dates_tags?: string[];
  rev?: number;

  // Contributors
  creator?: string;
  last_editor?: string;
  last_modified_by?: string;
  editors_tags?: string[];
  correctors_tags?: string[];
  informers_tags?: string[];
  photographers_tags?: string[];
  checkers_tags?: string[];
  weighers_tags?: string[];

  // Data sources
  sources?: DataSource[];
  sources_fields?: Record<string, any>;
  data_sources?: string;
  data_sources_imported?: string;
  data_sources_tags?: string[];

  // Data quality
  states?: string;
  states_tags?: string[];
  states_hierarchy?: string[];
  complete?: number;
  completeness?: number;
  data_quality_tags?: string[];
  data_quality_info_tags?: string[];
  data_quality_warnings_tags?: string[];
  data_quality_errors_tags?: string[];
  data_quality_bugs_tags?: string[];

  // Food groups (for scientific analysis)
  food_groups?: string;
  food_groups_tags?: string[];

  // PNNS groups (French nutrition classification)
  pnns_groups_1?: string;
  pnns_groups_2?: string;
  pnns_groups_1_tags?: string[];
  pnns_groups_2_tags?: string[];

  // Vitamins, minerals, and other substances
  vitamins_tags?: string[];
  vitamins_prev_tags?: string[];
  minerals_tags?: string[];
  minerals_prev_tags?: string[];
  amino_acids_tags?: string[];
  amino_acids_prev_tags?: string[];
  nucleotides_tags?: string[];
  nucleotides_prev_tags?: string[];
  other_nutritional_substances_tags?: string[];

  // Sweeteners
  ingredients_sweeteners_n?: number;
  ingredients_non_nutritive_sweeteners_n?: number;

  // EcoBalyse / Ciqual codes
  ingredients_without_ciqual_codes?: string[];
  ingredients_without_ciqual_codes_n?: number;
  ingredients_without_ecobalyse_ids?: string[];
  ingredients_without_ecobalyse_ids_n?: number;

  // Popularity and usage
  popularity_key?: number;
  popularity_tags?: string[];
  scans_n?: number;
  unique_scans_n?: number;

  // Miscellaneous
  product_type?: string;
  main_countries_tags?: string[];
  interface_version_created?: string;
  interface_version_modified?: string;
  link?: string;
  update_key?: string;
  expiration_date?: string;
  codes_tags?: string[];
  compared_to_category?: string;
  no_nutrition_data?: string;
  unknown_ingredients_n?: number;
  unknown_nutrients_tags?: string[];
  known_ingredients_n?: number;
  ciqual_food_name_tags?: string[];
  category_properties?: Record<string, any>;
  schema_version?: number;
  misc_tags?: string[];
  debug_param_sorted_langs?: string[];
  _keywords?: string[];
}

// ============================================================================
// Ingredient Types
// ============================================================================

export interface Ingredient {
  id?: string;
  text?: string;
  rank?: number;
  percent?: number;
  percent_min?: number;
  percent_max?: number;
  percent_estimate?: number;
  vegan?: string; // "yes", "no", "maybe"
  vegetarian?: string; // "yes", "no", "maybe"
  from_palm_oil?: string; // "yes", "no", "maybe"
  is_in_taxonomy?: number;
  ciqual_food_code?: string;
  ciqual_proxy_food_code?: string;
  ingredients?: Ingredient[]; // Nested ingredients
}

// ============================================================================
// Nutrition Types
// ============================================================================

export interface Nutriments {
  // Energy
  energy?: number;
  energy_unit?: string;
  energy_value?: number;
  energy_100g?: number;
  energy_serving?: number;
  'energy-kcal'?: number;
  'energy-kcal_unit'?: string;
  'energy-kcal_value'?: number;
  'energy-kcal_value_computed'?: number;
  'energy-kcal_100g'?: number;
  'energy-kcal_serving'?: number;
  'energy-kj'?: number;
  'energy-kj_unit'?: string;
  'energy-kj_value'?: number;
  'energy-kj_100g'?: number;
  'energy-kj_serving'?: number;

  // Macronutrients
  proteins?: number;
  proteins_unit?: string;
  proteins_value?: number;
  proteins_100g?: number;
  proteins_serving?: number;

  carbohydrates?: number;
  carbohydrates_unit?: string;
  carbohydrates_value?: number;
  carbohydrates_100g?: number;
  carbohydrates_serving?: number;

  sugars?: number;
  sugars_unit?: string;
  sugars_value?: number;
  sugars_100g?: number;
  sugars_serving?: number;

  fat?: number;
  fat_unit?: string;
  fat_value?: number;
  fat_100g?: number;
  fat_serving?: number;

  'saturated-fat'?: number;
  'saturated-fat_unit'?: string;
  'saturated-fat_value'?: number;
  'saturated-fat_100g'?: number;
  'saturated-fat_serving'?: number;

  fiber?: number;
  fiber_unit?: string;
  fiber_value?: number;
  fiber_100g?: number;
  fiber_serving?: number;

  // Salt and sodium
  salt?: number;
  salt_unit?: string;
  salt_value?: number;
  salt_100g?: number;
  salt_serving?: number;

  sodium?: number;
  sodium_unit?: string;
  sodium_value?: number;
  sodium_100g?: number;
  sodium_serving?: number;

  // Other nutrients
  cholesterol?: number;
  cholesterol_unit?: string;
  cholesterol_value?: number;
  cholesterol_100g?: number;
  cholesterol_serving?: number;

  // Fruits/vegetables estimates
  'fruits-vegetables-nuts-estimate-from-ingredients'?: number;
  'fruits-vegetables-nuts-estimate-from-ingredients_100g'?: number;
  'fruits-vegetables-nuts-estimate-from-ingredients_serving'?: number;
  'fruits-vegetables-legumes-estimate'?: number;
  'fruits-vegetables-legumes-estimate_unit'?: string;
  'fruits-vegetables-legumes-estimate_value'?: number;
  'fruits-vegetables-legumes-estimate_100g'?: number;
  'fruits-vegetables-legumes-estimate_serving'?: number;
  'fruits-vegetables-legumes-estimate-from-ingredients'?: number;
  'fruits-vegetables-legumes-estimate-from-ingredients_100g'?: number;
  'fruits-vegetables-legumes-estimate-from-ingredients_serving'?: number;
  'fruits-vegetables-legumes-estimate_label'?: string;

  // NOVA group
  'nova-group'?: number;
  'nova-group_100g'?: number;
  'nova-group_serving'?: number;

  // Vitamins
  'vitamin-a'?: number;
  'vitamin-a_unit'?: string;
  'vitamin-a_value'?: number;
  'vitamin-a_100g'?: number;
  'vitamin-b1'?: number;
  'vitamin-b1_unit'?: string;
  'vitamin-b1_value'?: number;
  'vitamin-b1_100g'?: number;
  'vitamin-b2'?: number;
  'vitamin-b2_unit'?: string;
  'vitamin-b2_value'?: number;
  'vitamin-b2_100g'?: number;
  'vitamin-b6'?: number;
  'vitamin-b6_unit'?: string;
  'vitamin-b6_value'?: number;
  'vitamin-b6_100g'?: number;
  'vitamin-b9'?: number;
  'vitamin-b9_unit'?: string;
  'vitamin-b9_value'?: number;
  'vitamin-b9_100g'?: number;
  'vitamin-b12'?: number;
  'vitamin-b12_unit'?: string;
  'vitamin-b12_value'?: number;
  'vitamin-b12_100g'?: number;
  'vitamin-c'?: number;
  'vitamin-c_unit'?: string;
  'vitamin-c_value'?: number;
  'vitamin-c_100g'?: number;
  'vitamin-d'?: number;
  'vitamin-d_unit'?: string;
  'vitamin-d_value'?: number;
  'vitamin-d_100g'?: number;
  'vitamin-e'?: number;
  'vitamin-e_unit'?: string;
  'vitamin-e_value'?: number;
  'vitamin-e_100g'?: number;
  'vitamin-pp'?: number;
  'vitamin-pp_unit'?: string;
  'vitamin-pp_value'?: number;
  'vitamin-pp_100g'?: number;

  // Minerals
  calcium?: number;
  calcium_unit?: string;
  calcium_value?: number;
  calcium_100g?: number;
  iron?: number;
  iron_unit?: string;
  iron_value?: number;
  iron_100g?: number;
  magnesium?: number;
  magnesium_unit?: string;
  magnesium_value?: number;
  magnesium_100g?: number;
  phosphorus?: number;
  phosphorus_unit?: string;
  phosphorus_value?: number;
  phosphorus_100g?: number;
  potassium?: number;
  potassium_unit?: string;
  potassium_value?: number;
  potassium_100g?: number;
  potassium_serving?: number;
  zinc?: number;
  zinc_unit?: string;
  zinc_value?: number;
  zinc_100g?: number;
  copper?: number;
  copper_unit?: string;
  copper_value?: number;
  copper_100g?: number;
  manganese?: number;
  manganese_unit?: string;
  manganese_value?: number;
  manganese_100g?: number;
  selenium?: number;
  selenium_unit?: string;
  selenium_value?: number;
  selenium_100g?: number;
  iodine?: number;
  iodine_unit?: string;
  iodine_value?: number;
  iodine_100g?: number;

  // Specific nutrients
  alcohol?: number;
  alcohol_unit?: string;
  alcohol_value?: number;
  alcohol_100g?: number;
  cocoa?: number;
  cocoa_unit?: string;
  cocoa_value?: number;
  cocoa_100g?: number;
  cocoa_serving?: number;
  cocoa_label?: string;
  'beta-carotene'?: number;
  'beta-carotene_unit'?: string;
  'beta-carotene_value'?: number;
  'beta-carotene_100g'?: number;
  'pantothenic-acid'?: number;
  'pantothenic-acid_unit'?: string;
  'pantothenic-acid_value'?: number;
  'pantothenic-acid_100g'?: number;
  phylloquinone?: number;
  phylloquinone_unit?: string;
  phylloquinone_value?: number;
  phylloquinone_100g?: number;

  // Sugars breakdown
  starch?: number;
  starch_unit?: string;
  starch_value?: number;
  starch_100g?: number;
  polyols?: number;
  polyols_unit?: string;
  polyols_value?: number;
  polyols_100g?: number;
  fructose?: number;
  fructose_unit?: string;
  fructose_value?: number;
  fructose_100g?: number;
  glucose?: number;
  glucose_unit?: string;
  glucose_value?: number;
  glucose_100g?: number;
  sucrose?: number;
  sucrose_unit?: string;
  sucrose_value?: number;
  sucrose_100g?: number;
  lactose?: number;
  lactose_unit?: string;
  lactose_value?: number;
  lactose_100g?: number;
  maltose?: number;
  maltose_unit?: string;
  maltose_value?: number;
  maltose_100g?: number;
  galactose?: number;
  galactose_unit?: string;
  galactose_value?: number;
  galactose_100g?: number;

  // Water
  water?: number;
  water_unit?: string;
  water_value?: number;
  water_100g?: number;

  // Nutrition score
  'nutrition-score-fr'?: number;
  'nutrition-score-fr_100g'?: number;

  // Can have many more dynamic fields
  [key: string]: any;
}

export interface NutrientLevels {
  fat?: 'low' | 'moderate' | 'high';
  'saturated-fat'?: 'low' | 'moderate' | 'high';
  sugars?: 'low' | 'moderate' | 'high';
  salt?: 'low' | 'moderate' | 'high';
}

// ============================================================================
// Nutrition Scoring Types
// ============================================================================

export interface NutriScore {
  '2021'?: NutriScoreVersion;
  '2023'?: NutriScoreVersion;
}

export interface NutriScoreVersion {
  grade?: string;
  score?: number;
  category_available?: number;
  nutriscore_computed?: number;
  nutriscore_applicable?: number;
  nutrients_available?: number;
  data?: NutriScoreVersionData;
}

export interface NutriScoreVersionData {
  energy?: number;
  energy_value?: number;
  energy_points?: number;
  sugars?: number;
  sugars_value?: number;
  sugars_points?: number;
  'saturated_fat'?: number;
  saturated_fat_value?: number;
  saturated_fat_points?: number;
  saturated_fat_ratio?: number;
  sodium?: number;
  sodium_value?: number;
  sodium_points?: number;
  proteins?: number;
  proteins_value?: number;
  proteins_points?: number;
  fiber?: number;
  fiber_value?: number;
  fiber_points?: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils?: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils_value?: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils_points?: number;
  is_beverage?: number;
  is_water?: number;
  is_cheese?: number;
  is_fat?: number;
  negative_points?: number;
  positive_points?: number;
}

export interface NutriScoreData {
  grade?: string;
  score?: number;
  is_beverage?: number;
  is_water?: number;
  is_cheese?: number;
  is_fat_oil_nuts_seeds?: number;
  is_red_meat_product?: number;
  negative_points?: number;
  negative_points_max?: number;
  positive_points?: number;
  positive_points_max?: number;
  positive_nutrients?: string[];
  count_proteins?: number;
  count_proteins_reason?: string;
  components?: {
    positive?: NutriScoreComponent[];
    negative?: NutriScoreComponent[];
  };
}

export interface NutriScoreComponent {
  id?: string;
  value?: number | null;
  unit?: string;
  points?: number;
  points_max?: number;
}

// ============================================================================
// Eco-Score Types
// ============================================================================

export interface EcoScoreData {
  grade?: string;
  score?: number;
  status?: string;
  previous_data?: any;
  missing?: {
    labels?: number;
    origins?: number;
    packagings?: number;
    agb_category?: number;
    ingredients?: number;
  };
  missing_data_warning?: number;
  missing_key_data?: number;
  missing_agribalyse_match_warning?: number;
  adjustments?: {
    origins_of_ingredients?: EcoScoreOriginsAdjustment;
    packaging?: EcoScorePackagingAdjustment;
    production_system?: EcoScoreProductionSystemAdjustment;
    threatened_species?: EcoScoreThreateneSpeciesAdjustment;
  };
  agribalyse?: AgribalyseData;
  scores?: Record<string, number>;
  grades?: Record<string, string>;
}

export interface EcoScoreOriginsAdjustment {
  value?: number;
  epi_score?: number;
  epi_value?: number;
  origins_from_origins_field?: string[];
  origins_from_categories?: string[];
  aggregated_origins?: Array<{
    origin?: string;
    percent?: number;
  }>;
  transportation_scores?: Record<string, number>;
  transportation_values?: Record<string, number>;
  values?: Record<string, number>;
  warning?: string;
}

export interface EcoScorePackagingAdjustment {
  value?: number;
  score?: number;
  non_recyclable_and_non_biodegradable_materials?: number;
  packagings?: Array<{
    material?: string;
    shape?: string;
    recycling?: string;
    number_of_units?: number;
    quantity_per_unit?: string;
    food_contact?: number;
    environmental_score_material_score?: number;
    environmental_score_shape_ratio?: number;
  }>;
  warning?: string;
}

export interface EcoScoreProductionSystemAdjustment {
  value?: number;
  labels?: string[];
  warning?: string;
}

export interface EcoScoreThreateneSpeciesAdjustment {
  warning?: string;
}

export interface AgribalyseData {
  code?: string;
  name_en?: string;
  name_fr?: string;
  agribalyse_food_code?: string;
  agribalyse_proxy_food_code?: string;
  version?: string;
  score?: number;
  is_beverage?: number;
  dqr?: string;

  // CO2 emissions
  co2_total?: number;
  co2_agriculture?: number;
  co2_processing?: number;
  co2_packaging?: number;
  co2_transportation?: number;
  co2_distribution?: number;
  co2_consumption?: number;

  // Environmental footprint (EF)
  ef_total?: number;
  ef_agriculture?: number;
  ef_processing?: number;
  ef_packaging?: number;
  ef_transportation?: number;
  ef_distribution?: number;
  ef_consumption?: number;
}

// ============================================================================
// Environmental Score (Legacy)
// ============================================================================

export interface EnvironmentalScoreData {
  status?: string;
  grade?: string;
  score?: number;
  missing_data_warning?: number;
  missing_key_data?: number;
  missing_agribalyse_match_warning?: number;
  missing?: {
    labels?: number;
    origins?: number;
    packagings?: number;
    agb_category?: number;
    ingredients?: number;
  };
  adjustments?: {
    origins_of_ingredients?: any;
    packaging?: any;
    production_system?: any;
    threatened_species?: any;
  };
  agribalyse?: AgribalyseData;
  scores?: Record<string, number>;
  grades?: Record<string, string>;
}

// ============================================================================
// Packaging Types
// ============================================================================

export interface Packaging {
  material?: string;
  shape?: string;
  recycling?: string;
  number_of_units?: number;
  quantity_per_unit?: string;
  weight_measured?: number;
  food_contact?: number;
  environmental_score_material_score?: number;
  environmental_score_shape_ratio?: number;
}

// ============================================================================
// Image Types
// ============================================================================

export interface ProductImages {
  [key: string]: ProductImage | ProductImageMetadata;
}

export interface ProductImage {
  uploader?: string;
  uploaded_t?: number | string;
  sizes?: {
    '100'?: ImageSize;
    '200'?: ImageSize;
    '400'?: ImageSize;
    full?: ImageSize;
  };
}

export interface ProductImageMetadata extends ProductImage {
  imgid?: string;
  rev?: string;
  white_magic?: string | null;
  normalize?: string | null;
  geometry?: string;
  x1?: string | number | null;
  x2?: string | number | null;
  y1?: string | number | null;
  y2?: string | number | null;
  angle?: string | number | null;
  orientation?: string;
  ocr?: number;
}

export interface ImageSize {
  w?: number;
  h?: number;
}

// ============================================================================
// Data Source Types
// ============================================================================

export interface DataSource {
  id?: string;
  name?: string;
  url?: string | null;
  manufacturer?: string | null;
  import_t?: number;
  fields?: string[];
  images?: any[];
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Simplified product type with only essential fields for database storage
 */
export interface ProductCore {
  code: string;
  product_name?: string;
  brands?: string;
  quantity?: string;
  categories?: string;
  image_url?: string;
  nutriments?: Partial<Nutriments>;
  nutriscore_grade?: string;
  nova_group?: number;
  ecoscore_grade?: string;
}

/**
 * Type for search/filter parameters
 */
export interface ProductSearchParams {
  code?: string;
  brands?: string;
  categories?: string[];
  allergens?: string[];
  nutriscore_grade?: string[];
  nova_group?: number[];
  ecoscore_grade?: string[];
}
