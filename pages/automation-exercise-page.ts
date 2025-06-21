import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { AutomationExerciseLocators as Locators } from '../locators/automation-exercise-locators';
import { Logger } from '../utils/logger';

export class AutomationExercisePage extends BasePage {
  protected logger = new Logger('AutomationExercisePage');

  // Navigation elements
  readonly navHome: Locator;
  readonly navProducts: Locator;
  readonly navCart: Locator;
  readonly navSignupLogin: Locator;
  readonly navLogout: Locator;
  readonly navDeleteAccount: Locator;
  readonly navContactUs: Locator;
  readonly navTestCases: Locator;
  readonly navApiTesting: Locator;

  // Login/Signup elements
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;
  readonly loggedInAs: Locator;
  readonly loginError: Locator;
  readonly signupError: Locator;

  // Product elements
  readonly productList: Locator;
  readonly productSearchInput: Locator;
  readonly productSearchButton: Locator;
  readonly addToCartButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartButton: Locator;

  // Cart elements
  readonly cartTable: Locator;
  readonly cartProductNames: Locator;
  readonly cartDeleteButtons: Locator;
  readonly proceedToCheckout: Locator;

  // Subscription elements
  readonly subscriptionEmail: Locator;
  readonly subscriptionButton: Locator;
  readonly subscriptionSuccess: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize navigation elements
    this.navHome = page.locator(Locators.NAV_HOME);
    this.navProducts = page.locator(Locators.NAV_PRODUCTS);
    this.navCart = page.locator(Locators.NAV_CART);
    this.navSignupLogin = page.locator(Locators.NAV_SIGNUP_LOGIN);
    this.navLogout = page.locator(Locators.NAV_LOGOUT);
    this.navDeleteAccount = page.locator(Locators.NAV_DELETE_ACCOUNT);
    this.navContactUs = page.locator(Locators.NAV_CONTACT_US);
    this.navTestCases = page.locator(Locators.NAV_TEST_CASES);
    this.navApiTesting = page.locator(Locators.NAV_API_TESTING);

    // Initialize login/signup elements
    this.loginEmail = page.locator(Locators.LOGIN_EMAIL);
    this.loginPassword = page.locator(Locators.LOGIN_PASSWORD);
    this.loginButton = page.locator(Locators.LOGIN_BUTTON);
    this.signupName = page.locator(Locators.SIGNUP_NAME);
    this.signupEmail = page.locator(Locators.SIGNUP_EMAIL);
    this.signupButton = page.locator(Locators.SIGNUP_BUTTON);
    this.loggedInAs = page.locator(Locators.LOGGED_IN_AS);
    this.loginError = page.locator(Locators.LOGIN_ERROR);
    this.signupError = page.locator(Locators.SIGNUP_ERROR);

    // Initialize product elements
    this.productList = page.locator(Locators.PRODUCT_LIST);
    this.productSearchInput = page.locator(Locators.PRODUCT_SEARCH_INPUT);
    this.productSearchButton = page.locator(Locators.PRODUCT_SEARCH_BUTTON);
    this.addToCartButtons = page.locator(Locators.ADD_TO_CART_BUTTON);
    this.continueShoppingButton = page.locator(Locators.CONTINUE_SHOPPING_BUTTON);
    this.viewCartButton = page.locator(Locators.VIEW_CART_BUTTON);

    // Initialize cart elements
    this.cartTable = page.locator(Locators.CART_TABLE);
    this.cartProductNames = page.locator(Locators.CART_PRODUCT_NAME);
    this.cartDeleteButtons = page.locator(Locators.CART_DELETE_BUTTON);
    this.proceedToCheckout = page.locator(Locators.PROCEED_TO_CHECKOUT);

    // Initialize subscription elements
    this.subscriptionEmail = page.locator(Locators.SUBSCRIPTION_EMAIL);
    this.subscriptionButton = page.locator(Locators.SUBSCRIPTION_BUTTON);
    this.subscriptionSuccess = page.locator(Locators.SUBSCRIPTION_SUCCESS);
  }

  // Navigation methods
  async navigateToHome() {
    this.logger.step('Navigating to home page');
    await this.navHome.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToProducts() {
    this.logger.step('Navigating to products page');
    await this.navProducts.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToCart() {
    this.logger.step('Navigating to cart page');
    await this.navCart.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToSignupLogin() {
    this.logger.step('Navigating to signup/login page');
    await this.navSignupLogin.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToContactUs() {
    this.logger.step('Navigating to contact us page');
    await this.navContactUs.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToTestCases() {
    this.logger.step('Navigating to test cases page');
    await this.navTestCases.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToApiTesting() {
    this.logger.step('Navigating to API testing page');
    await this.navApiTesting.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Login methods
  async login(email: string, password: string) {
    this.logger.step(`Logging in with email: ${email}`);
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyLoginSuccess() {
    this.logger.step('Verifying login success');
    await expect(this.loggedInAs).toBeVisible();
  }

  async verifyLoginError() {
    this.logger.step('Verifying login error');
    await expect(this.loginError).toBeVisible();
  }

  // Signup methods
  async signup(name: string, email: string) {
    this.logger.step(`Signing up with name: ${name}, email: ${email}`);
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifySignupError() {
    this.logger.step('Verifying signup error');
    await expect(this.signupError).toBeVisible();
  }

  // Logout method
  async logout() {
    this.logger.step('Logging out');
    await this.navLogout.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Product methods
  async searchProduct(productName: string) {
    this.logger.step(`Searching for product: ${productName}`);
    await this.productSearchInput.fill(productName);
    await this.productSearchButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async addProductToCart(productIndex: number = 0) {
    this.logger.step(`Adding product ${productIndex + 1} to cart`);
    const addToCartButton = this.addToCartButtons.nth(productIndex);
    await addToCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async continueShopping() {
    this.logger.step('Continuing shopping');
    await this.continueShoppingButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async viewCart() {
    this.logger.step('Viewing cart');
    await this.viewCartButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Cart methods
  async verifyProductInCart(productName: string) {
    this.logger.step(`Verifying product ${productName} is in cart`);
    await expect(this.cartProductNames.filter({ hasText: productName })).toBeVisible();
  }

  async removeProductFromCart(productIndex: number = 0) {
    this.logger.step(`Removing product ${productIndex + 1} from cart`);
    const deleteButton = this.cartDeleteButtons.nth(productIndex);
    await deleteButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyCartIsEmpty() {
    this.logger.step('Verifying cart is empty');
    await expect(this.cartTable).not.toBeVisible();
  }

  // Subscription methods
  async subscribeToNewsletter(email: string) {
    this.logger.step(`Subscribing to newsletter with email: ${email}`);
    await this.subscriptionEmail.fill(email);
    await this.subscriptionButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifySubscriptionSuccess() {
    this.logger.step('Verifying subscription success');
    await expect(this.subscriptionSuccess).toBeVisible();
  }

  // Account deletion
  async deleteAccount() {
    this.logger.step('Deleting account');
    await this.navDeleteAccount.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyAccountDeleted() {
    this.logger.step('Verifying account deleted');
    await expect(this.page.locator(Locators.ACCOUNT_DELETED)).toBeVisible();
  }

  async continueAfterAccountDeletion() {
    this.logger.step('Continuing after account deletion');
    await this.page.locator(Locators.CONTINUE_BUTTON).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Utility methods
  async getProductCount() {
    return await this.productList.count();
  }

  async getCartProductCount() {
    return await this.cartProductNames.count();
  }

  async isLoggedIn() {
    return await this.loggedInAs.isVisible();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }
} 