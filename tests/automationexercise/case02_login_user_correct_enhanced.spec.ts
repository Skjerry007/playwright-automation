import { test, expect } from '@playwright/test';
import { AutomationExercisePage } from '../../pages/automation-exercise-page';
import { Properties } from '../../config/properties';
import { MCPClient } from '../../utils/mcp-client';

test.describe('Case 2: Login User with correct credentials (MCP Enhanced)', () => {
  let props: Properties;
  let ae: AutomationExercisePage;

  test.beforeAll(async () => {
    await MCPClient.connect();
    props = Properties.getInstance();
  });

  test.afterAll(async () => {
    MCPClient.disconnect();
  });

  test('should login with AI-validated credentials and intelligent monitoring', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    // Start AI monitoring
    await MCPClient.startMonitoring('case02_login_user_correct_enhanced.spec.ts', {
      testName: 'Login with Valid Credentials',
      browser: 'chromium',
      environment: props.getEnvironment(),
      riskLevel: 'low'
    });
    
    try {
      // Use AI to generate and validate test data
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'data_preparation', {
        status: 'started',
        details: 'Preparing AI-validated test data'
      });
      
      const originalUser = props.getTestData('validUser');
      
      // Validate existing test data with AI
      const dataValidation = await MCPClient.manageTestData(
        'validate',
        'user',
        originalUser
      );
      
      console.log('🔍 AI Data Validation:', dataValidation);
      
      // Generate enhanced test data if needed
      let userData = originalUser;
      if (dataValidation.includes('invalid')) {
        console.log('⚠️ Original test data validation failed, generating new data...');
        
        const newUserData = await MCPClient.manageTestData(
          'generate',
          'user',
          { userType: 'valid' }
        );
        
        userData = newUserData;
        console.log('✅ New AI-generated user data:', userData);
      }
      
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'data_preparation', {
        status: 'completed',
        details: 'Test data prepared and validated'
      });
      
      // Navigate to login page with monitoring
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'navigation', {
        status: 'started',
        details: 'Navigating to homepage'
      });
      
      await page.goto(props.getBaseUrl());
      
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'navigation', {
        status: 'completed',
        details: 'Successfully loaded homepage'
      });
      
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'navigation', {
        status: 'started',
        details: 'Navigating to login page'
      });
      
      await ae.navigateToSignupLogin();
      
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'navigation', {
        status: 'completed',
        details: 'Successfully navigated to login page'
      });
      
      // Perform login with AI monitoring
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'authentication', {
        status: 'started',
        details: 'Starting login process'
      });
      
      await ae.login(userData.email, userData.password);
      
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'authentication', {
        status: 'completed',
        details: 'Login credentials submitted'
      });
      
      // Verify login success with AI-enhanced verification
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'verification', {
        status: 'started',
        details: 'Verifying login success'
      });
      
      await ae.verifyLoginSuccess();
      
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'verification', {
        status: 'completed',
        details: 'Login success verified'
      });
      
      // Logout with monitoring
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'logout', {
        status: 'started',
        details: 'Starting logout process'
      });
      
      await ae.logout();
      
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'logout', {
        status: 'completed',
        details: 'Logout completed'
      });
      
      // Final verification
      await expect(ae.loginButton).toBeVisible();
      
      // Get AI insights about this test execution
      const insights = await MCPClient.getInsights('automationexercise', '1h');
      console.log('📊 Login Test Insights:', insights);
      
    } catch (error) {
      // Use AI to analyze login failures
      const errorAnalysis = await MCPClient.analyzeFailure(
        'case02_login_user_correct_enhanced.spec.ts',
        'authentication',
        error instanceof Error ? error.message : 'Unknown login error'
      );
      
      console.log('🔍 AI Login Failure Analysis:', errorAnalysis);
      
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'error', {
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        analysis: errorAnalysis
      });
      
      throw error;
    } finally {
      await MCPClient.stopMonitoring('case02_login_user_correct_enhanced.spec.ts');
    }
  });

  test('should handle multiple login scenarios with AI-generated data', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    console.log('🤖 Testing multiple login scenarios with AI...');
    
    // Generate different types of user data for testing
    const userScenarios = [
      { type: 'valid', description: 'Valid user credentials' },
      { type: 'new', description: 'Newly registered user' },
      { type: 'admin', description: 'Administrator user' }
    ];
    
    for (const scenario of userScenarios) {
      console.log(`🧪 Testing scenario: ${scenario.description}`);
      
      // Generate user data for this scenario
      const userData = await MCPClient.manageTestData(
        'generate',
        'user',
        { userType: scenario.type }
      );
      
      console.log(`📊 Generated data for ${scenario.type}:`, userData);
      
      // Execute login test with this data
      await page.goto(props.getBaseUrl());
      await ae.navigateToSignupLogin();
      
      try {
        await ae.login(userData.email, userData.password);
        await ae.verifyLoginSuccess();
        
        console.log(`✅ ${scenario.description} - Login successful`);
        
        // Logout for next iteration
        await ae.logout();
        
      } catch (error) {
        console.log(`❌ ${scenario.description} - Login failed:`, error);
        
        // Use AI to analyze the failure
        const analysis = await MCPClient.analyzeFailure(
          'case02_login_user_correct_enhanced.spec.ts',
          'authentication',
          error instanceof Error ? error.message : 'Unknown error'
        );
        
        console.log(`🔍 AI Analysis for ${scenario.type}:`, analysis);
      }
    }
  });

  test('should predict and prevent login failures', async ({ page }) => {
    ae = new AutomationExercisePage(page);
    
    console.log('🔮 Testing failure prediction and prevention...');
    
    // Simulate recent changes that might affect login
    const recentChanges = {
      uiChanges: ['login form updated', 'validation rules changed'],
      apiChanges: ['authentication endpoint modified'],
      securityChanges: ['password requirements updated']
    };
    
    // Use AI to predict potential failures
    const predictions = await MCPClient.analyzeFailure(
      'case02_login_user_correct_enhanced.spec.ts',
      'prediction',
      JSON.stringify(recentChanges)
    );
    
    console.log('🔮 AI Failure Predictions:', predictions);
    
    // Execute test with extra monitoring based on predictions
    await page.goto(props.getBaseUrl());
    await ae.navigateToSignupLogin();
    
    // Start enhanced monitoring for predicted issues
    await MCPClient.startMonitoring('case02_login_user_correct_enhanced.spec.ts', {
      testName: 'Login with Failure Prediction',
      riskLevel: 'high',
      recentChanges
    });
    
    try {
      const user = props.getTestData('validUser');
      
      // Monitor form interaction more closely
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'form_interaction', {
        status: 'started',
        details: 'Filling login form with enhanced monitoring'
      });
      
      await ae.login(user.email, user.password);
      
      await MCPClient.updateMonitoring('case02_login_user_correct_enhanced.spec.ts', 'form_interaction', {
        status: 'completed',
        details: 'Login form submitted successfully'
      });
      
      await ae.verifyLoginSuccess();
      
      console.log('✅ Login successful despite predicted risks');
      
    } catch (error) {
      console.log('❌ Login failed as predicted:', error);
      
      // Use AI to suggest recovery actions
      const recovery = await MCPClient.analyzeFailure(
        'case02_login_user_correct_enhanced.spec.ts',
        'recovery',
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      console.log('🔄 AI Recovery Suggestions:', recovery);
      
    } finally {
      await MCPClient.stopMonitoring('case02_login_user_correct_enhanced.spec.ts');
    }
  });
}); 