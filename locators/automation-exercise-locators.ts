export class AutomationExerciseLocators {
  // Header
  static readonly NAV_HOME = 'a[href="/"]';
  static readonly NAV_PRODUCTS = 'a[href="/products"]';
  static readonly NAV_CART = 'a[href="/view_cart"]';
  static readonly NAV_SIGNUP_LOGIN = 'a[href="/login"]';
  static readonly NAV_LOGOUT = 'a[href="/logout"]';
  static readonly NAV_DELETE_ACCOUNT = 'a[href="/delete_account"]';
  static readonly NAV_CONTACT_US = 'a[href="/contact_us"]';
  static readonly NAV_TEST_CASES = 'a[href="/test_cases"]';
  static readonly NAV_API_TESTING = 'a[href="/api_list"]';

  // Login/Signup
  static readonly LOGIN_EMAIL = 'input[data-qa="login-email"]';
  static readonly LOGIN_PASSWORD = 'input[data-qa="login-password"]';
  static readonly LOGIN_BUTTON = 'button[data-qa="login-button"]';
  static readonly SIGNUP_NAME = 'input[data-qa="signup-name"]';
  static readonly SIGNUP_EMAIL = 'input[data-qa="signup-email"]';
  static readonly SIGNUP_BUTTON = 'button[data-qa="signup-button"]';
  static readonly LOGGED_IN_AS = 'a:has-text("Logged in as")';
  static readonly LOGIN_ERROR = 'p:has-text("Your email or password is incorrect!")';
  static readonly SIGNUP_ERROR = 'p:has-text("Email Address already exist!")';

  // Account Deletion
  static readonly ACCOUNT_DELETED = 'b:has-text("Account Deleted!")';
  static readonly CONTINUE_BUTTON = 'a[data-qa="continue-button"]';

  // Contact Us
  static readonly CONTACT_NAME = 'input[data-qa="name"]';
  static readonly CONTACT_EMAIL = 'input[data-qa="email"]';
  static readonly CONTACT_SUBJECT = 'input[data-qa="subject"]';
  static readonly CONTACT_MESSAGE = 'textarea[data-qa="message"]';
  static readonly CONTACT_UPLOAD = 'input[name="upload_file"]';
  static readonly CONTACT_SUBMIT = 'input[data-qa="submit-button"]';
  static readonly CONTACT_SUCCESS = 'div.status.alert-success';

  // Products
  static readonly PRODUCT_LIST = '.features_items .product-image-wrapper';
  static readonly PRODUCT_SEARCH_INPUT = '#search_product';
  static readonly PRODUCT_SEARCH_BUTTON = '#submit_search';
  static readonly PRODUCT_VIEW = 'a[href^="/product_details/"]';
  static readonly ADD_TO_CART_BUTTON = 'a:has-text("Add to cart")';
  static readonly CONTINUE_SHOPPING_BUTTON = 'button.close-modal';
  static readonly VIEW_CART_BUTTON = 'u:has-text("View Cart")';
  static readonly PRODUCT_NAME = '.productinfo.text-center p';
  static readonly PRODUCT_PRICE = '.productinfo.text-center h2';

  // Cart
  static readonly CART_TABLE = '#cart_info_table';
  static readonly CART_PRODUCT_NAME = '#cart_info_table td.cart_description h4 a';
  static readonly CART_DELETE_BUTTON = 'a.cart_quantity_delete';
  static readonly CART_QUANTITY_INPUT = 'button.cart_quantity_up, button.cart_quantity_down';
  static readonly PROCEED_TO_CHECKOUT = '.check_out';

  // Subscription
  static readonly SUBSCRIPTION_EMAIL = '#susbscribe_email';
  static readonly SUBSCRIPTION_BUTTON = '#subscribe';
  static readonly SUBSCRIPTION_SUCCESS = 'div.alert-success:has-text("You have been successfully subscribed!")';

  // Footer
  static readonly FOOTER = 'footer .footer-widget';

  // Test Cases Page
  static readonly TEST_CASES_HEADER = 'h2.title.text-center:has-text("Test Cases")';

  // API Testing Page
  static readonly API_LIST_HEADER = 'h2.title.text-center:has-text("APIs List for practice")';
} 