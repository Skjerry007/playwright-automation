export class CommonLocators {
  // Navigation
  static readonly NAVIGATION = {
    HOME_LINK: '[data-testid="nav-home"]',
    ABOUT_LINK: '[data-testid="nav-about"]',
    CONTACT_LINK: '[data-testid="nav-contact"]',
    LOGIN_LINK: '[data-testid="nav-login"]',
    LOGOUT_LINK: '[data-testid="nav-logout"]',
    PROFILE_LINK: '[data-testid="nav-profile"]',
    CART_LINK: '[data-testid="nav-cart"]',
    SEARCH_BUTTON: '[data-testid="search-button"]',
    MENU_TOGGLE: '[data-testid="menu-toggle"]'
  };

  // Forms
  static readonly FORMS = {
    USERNAME_INPUT: '[data-testid="username-input"]',
    PASSWORD_INPUT: '[data-testid="password-input"]',
    EMAIL_INPUT: '[data-testid="email-input"]',
    FIRST_NAME_INPUT: '[data-testid="first-name-input"]',
    LAST_NAME_INPUT: '[data-testid="last-name-input"]',
    PHONE_INPUT: '[data-testid="phone-input"]',
    ADDRESS_INPUT: '[data-testid="address-input"]',
    CITY_INPUT: '[data-testid="city-input"]',
    ZIP_CODE_INPUT: '[data-testid="zip-code-input"]',
    COUNTRY_SELECT: '[data-testid="country-select"]',
    SUBMIT_BUTTON: '[data-testid="submit-button"]',
    CANCEL_BUTTON: '[data-testid="cancel-button"]',
    RESET_BUTTON: '[data-testid="reset-button"]'
  };

  // Buttons
  static readonly BUTTONS = {
    PRIMARY_BUTTON: '[data-testid="primary-button"]',
    SECONDARY_BUTTON: '[data-testid="secondary-button"]',
    DANGER_BUTTON: '[data-testid="danger-button"]',
    SUCCESS_BUTTON: '[data-testid="success-button"]',
    WARNING_BUTTON: '[data-testid="warning-button"]',
    INFO_BUTTON: '[data-testid="info-button"]',
    CLOSE_BUTTON: '[data-testid="close-button"]',
    SAVE_BUTTON: '[data-testid="save-button"]',
    DELETE_BUTTON: '[data-testid="delete-button"]',
    EDIT_BUTTON: '[data-testid="edit-button"]',
    ADD_BUTTON: '[data-testid="add-button"]',
    SEARCH_BUTTON: '[data-testid="search-button"]',
    FILTER_BUTTON: '[data-testid="filter-button"]',
    SORT_BUTTON: '[data-testid="sort-button"]'
  };

  // Messages
  static readonly MESSAGES = {
    SUCCESS_MESSAGE: '[data-testid="success-message"]',
    ERROR_MESSAGE: '[data-testid="error-message"]',
    WARNING_MESSAGE: '[data-testid="warning-message"]',
    INFO_MESSAGE: '[data-testid="info-message"]',
    LOADING_MESSAGE: '[data-testid="loading-message"]',
    VALIDATION_MESSAGE: '[data-testid="validation-message"]'
  };

  // Modals
  static readonly MODALS = {
    CONFIRMATION_MODAL: '[data-testid="confirmation-modal"]',
    CONFIRM_BUTTON: '[data-testid="confirm-button"]',
    CANCEL_BUTTON: '[data-testid="cancel-button"]',
    MODAL_CLOSE: '[data-testid="modal-close"]',
    MODAL_OVERLAY: '[data-testid="modal-overlay"]'
  };

  // Tables
  static readonly TABLES = {
    DATA_TABLE: '[data-testid="data-table"]',
    TABLE_HEADER: '[data-testid="table-header"]',
    TABLE_ROW: '[data-testid="table-row"]',
    TABLE_CELL: '[data-testid="table-cell"]',
    PAGINATION: '[data-testid="pagination"]',
    NEXT_PAGE: '[data-testid="next-page"]',
    PREV_PAGE: '[data-testid="prev-page"]',
    FIRST_PAGE: '[data-testid="first-page"]',
    LAST_PAGE: '[data-testid="last-page"]'
  };

  // Dropdowns
  static readonly DROPDOWNS = {
    DROPDOWN_TOGGLE: '[data-testid="dropdown-toggle"]',
    DROPDOWN_MENU: '[data-testid="dropdown-menu"]',
    DROPDOWN_ITEM: '[data-testid="dropdown-item"]',
    SELECT_OPTION: '[data-testid="select-option"]'
  };

  // Checkboxes and Radio buttons
  static readonly INPUTS = {
    CHECKBOX: '[data-testid="checkbox"]',
    RADIO_BUTTON: '[data-testid="radio-button"]',
    TOGGLE_SWITCH: '[data-testid="toggle-switch"]',
    SLIDER: '[data-testid="slider"]',
    FILE_INPUT: '[data-testid="file-input"]'
  };

  // Links
  static readonly LINKS = {
    EXTERNAL_LINK: '[data-testid="external-link"]',
    INTERNAL_LINK: '[data-testid="internal-link"]',
    DOWNLOAD_LINK: '[data-testid="download-link"]',
    BACK_LINK: '[data-testid="back-link"]',
    NEXT_LINK: '[data-testid="next-link"]'
  };

  // Icons
  static readonly ICONS = {
    EDIT_ICON: '[data-testid="edit-icon"]',
    DELETE_ICON: '[data-testid="delete-icon"]',
    VIEW_ICON: '[data-testid="view-icon"]',
    DOWNLOAD_ICON: '[data-testid="download-icon"]',
    UPLOAD_ICON: '[data-testid="upload-icon"]',
    SEARCH_ICON: '[data-testid="search-icon"]',
    FILTER_ICON: '[data-testid="filter-icon"]',
    SORT_ICON: '[data-testid="sort-icon"]',
    CLOSE_ICON: '[data-testid="close-icon"]',
    MENU_ICON: '[data-testid="menu-icon"]'
  };

  // Loading states
  static readonly LOADING = {
    SPINNER: '[data-testid="spinner"]',
    SKELETON: '[data-testid="skeleton"]',
    PROGRESS_BAR: '[data-testid="progress-bar"]',
    LOADING_OVERLAY: '[data-testid="loading-overlay"]'
  };

  // Breadcrumbs
  static readonly BREADCRUMBS = {
    BREADCRUMB_CONTAINER: '[data-testid="breadcrumb-container"]',
    BREADCRUMB_ITEM: '[data-testid="breadcrumb-item"]',
    BREADCRUMB_SEPARATOR: '[data-testid="breadcrumb-separator"]'
  };

  // Tabs
  static readonly TABS = {
    TAB_CONTAINER: '[data-testid="tab-container"]',
    TAB_ITEM: '[data-testid="tab-item"]',
    TAB_CONTENT: '[data-testid="tab-content"]',
    ACTIVE_TAB: '[data-testid="active-tab"]'
  };

  // Accordion
  static readonly ACCORDION = {
    ACCORDION_ITEM: '[data-testid="accordion-item"]',
    ACCORDION_HEADER: '[data-testid="accordion-header"]',
    ACCORDION_CONTENT: '[data-testid="accordion-content"]',
    ACCORDION_TOGGLE: '[data-testid="accordion-toggle"]'
  };

  // Tooltips
  static readonly TOOLTIPS = {
    TOOLTIP_CONTAINER: '[data-testid="tooltip-container"]',
    TOOLTIP_TRIGGER: '[data-testid="tooltip-trigger"]',
    TOOLTIP_CONTENT: '[data-testid="tooltip-content"]'
  };

  // Generic selectors
  static readonly GENERIC = {
    ANY_BUTTON: 'button',
    ANY_INPUT: 'input',
    ANY_LINK: 'a',
    ANY_HEADING: 'h1, h2, h3, h4, h5, h6',
    ANY_PARAGRAPH: 'p',
    ANY_IMAGE: 'img',
    ANY_FORM: 'form',
    ANY_SELECT: 'select',
    ANY_TEXTAREA: 'textarea'
  };
} 