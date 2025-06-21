import { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';
import { Logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

interface TestReport {
  testName: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted';
  duration: number;
  error?: string;
  screenshot?: string;
  video?: string;
  trace?: string;
  steps: TestStepReport[];
  timestamp: string;
  browser: string;
  project: string;
}

interface TestStepReport {
  title: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
}

export class CustomReporter implements Reporter {
  private logger = new Logger('CustomReporter');
  private reports: TestReport[] = [];
  private startTime: number = 0;

  onBegin(config: any, suite: any) {
    this.startTime = Date.now();
    this.logger.info('🚀 Test execution started');
    this.logger.info(`📊 Total tests: ${suite.allTests().length}`);
    this.logger.info(`🌐 Browsers: ${config.projects.map((p: any) => p.name).join(', ')}`);
  }

  onTestBegin(test: TestCase, result: TestResult) {
    this.logger.testStart(test.title);
  }

  onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
    this.logger.step(step.title);
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    // Step completed
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const testReport: TestReport = {
      testName: test.title,
      status: result.status,
      duration: result.duration,
      steps: result.steps.map(step => ({
        title: step.title,
        status: (step as any).status || 'passed',
        duration: step.duration,
        error: step.error?.message
      })),
      timestamp: new Date().toISOString(),
      browser: (result as any).projectName || 'unknown',
      project: (result as any).projectName || 'unknown'
    };

    // Add error details if test failed
    if (result.status === 'failed' && result.error) {
      testReport.error = result.error.message;
    }

    // Add attachments
    if (result.attachments) {
      const screenshot = result.attachments.find(a => a.contentType === 'image/png');
      const video = result.attachments.find(a => a.contentType === 'video/webm');
      const trace = result.attachments.find(a => a.contentType === 'application/octet-stream');

      if (screenshot) {
        testReport.screenshot = screenshot.path;
      }
      if (video) {
        testReport.video = video.path;
      }
      if (trace) {
        testReport.trace = trace.path;
      }
    }

    this.reports.push(testReport);

    const status = result.status === 'passed' ? 'PASSED' : result.status === 'failed' ? 'FAILED' : 'SKIPPED';
    this.logger.testEnd(test.title, status as 'PASSED' | 'FAILED' | 'SKIPPED');
  }

  onEnd(result: any) {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    this.generateReport();
    this.generateSummary(result);
    
    this.logger.info(`🏁 Test execution completed in ${this.formatDuration(totalDuration)}`);
  }

  private generateReport(): void {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const reportPath = path.join(reportsDir, 'custom-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.reports, null, 2));
    
    this.generateHtmlReport();
    this.generateMarkdownReport();
  }

  private generateSummary(result: any): void {
    const totalTests = this.reports.length;
    const passedTests = this.reports.filter(r => r.status === 'passed').length;
    const failedTests = this.reports.filter(r => r.status === 'failed').length;
    const skippedTests = this.reports.filter(r => r.status === 'skipped').length;
    const timedOutTests = this.reports.filter(r => r.status === 'timedOut').length;

    const summary = {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests,
      timedOut: timedOutTests,
      successRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00'
    };

    this.logger.info('📈 Test Summary:');
    this.logger.info(`   Total: ${summary.total}`);
    this.logger.info(`   Passed: ${summary.passed} ✅`);
    this.logger.info(`   Failed: ${summary.failed} ❌`);
    this.logger.info(`   Skipped: ${summary.skipped} ⏭️`);
    this.logger.info(`   Timed Out: ${summary.timedOut} ⏰`);
    this.logger.info(`   Success Rate: ${summary.successRate}%`);

    // Save summary to file
    const reportsDir = path.join(process.cwd(), 'reports');
    const summaryPath = path.join(reportsDir, 'test-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  }

  private generateHtmlReport(): void {
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .summary { display: flex; gap: 20px; margin-bottom: 20px; }
        .summary-item { background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .test-item { border: 1px solid #ddd; margin: 10px 0; border-radius: 5px; overflow: hidden; }
        .test-header { padding: 15px; background: #f9f9f9; border-bottom: 1px solid #ddd; }
        .test-details { padding: 15px; }
        .passed { border-left: 5px solid #28a745; }
        .failed { border-left: 5px solid #dc3545; }
        .skipped { border-left: 5px solid #ffc107; }
        .timedOut { border-left: 5px solid #fd7e14; }
        .status { font-weight: bold; }
        .passed .status { color: #28a745; }
        .failed .status { color: #dc3545; }
        .skipped .status { color: #ffc107; }
        .timedOut .status { color: #fd7e14; }
        .steps { margin-top: 10px; }
        .step { padding: 5px 0; border-bottom: 1px solid #eee; }
        .error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 3px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Playwright Test Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <div class="summary-item">
            <h3>Total Tests</h3>
            <p>${this.reports.length}</p>
        </div>
        <div class="summary-item">
            <h3>Passed</h3>
            <p style="color: #28a745;">${this.reports.filter(r => r.status === 'passed').length}</p>
        </div>
        <div class="summary-item">
            <h3>Failed</h3>
            <p style="color: #dc3545;">${this.reports.filter(r => r.status === 'failed').length}</p>
        </div>
        <div class="summary-item">
            <h3>Success Rate</h3>
            <p>${this.reports.length > 0 ? ((this.reports.filter(r => r.status === 'passed').length / this.reports.length) * 100).toFixed(2) : '0.00'}%</p>
        </div>
    </div>
    
    <div class="tests">
        ${this.reports.map(test => `
            <div class="test-item ${test.status}">
                <div class="test-header">
                    <h3>${test.testName}</h3>
                    <p class="status">Status: ${test.status.toUpperCase()}</p>
                    <p>Duration: ${this.formatDuration(test.duration)}</p>
                    <p>Browser: ${test.browser}</p>
                </div>
                <div class="test-details">
                    <div class="steps">
                        <h4>Test Steps:</h4>
                        ${test.steps.map(step => `
                            <div class="step">
                                <strong>${step.title}</strong> - ${step.status} (${this.formatDuration(step.duration)})
                                ${step.error ? `<div class="error">${step.error}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ${test.error ? `<div class="error"><strong>Test Error:</strong> ${test.error}</div>` : ''}
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    const reportsDir = path.join(process.cwd(), 'reports');
    const htmlPath = path.join(reportsDir, 'custom-report.html');
    fs.writeFileSync(htmlPath, htmlTemplate);
    
    this.logger.info(`📄 HTML report generated: ${htmlPath}`);
  }

  private generateMarkdownReport(): void {
    const markdown = `# Playwright Test Report

Generated on: ${new Date().toLocaleString()}

## Summary

- **Total Tests**: ${this.reports.length}
- **Passed**: ${this.reports.filter(r => r.status === 'passed').length} ✅
- **Failed**: ${this.reports.filter(r => r.status === 'failed').length} ❌
- **Skipped**: ${this.reports.filter(r => r.status === 'skipped').length} ⏭️
- **Timed Out**: ${this.reports.filter(r => r.status === 'timedOut').length} ⏰
- **Success Rate**: ${this.reports.length > 0 ? ((this.reports.filter(r => r.status === 'passed').length / this.reports.length) * 100).toFixed(2) : '0.00'}%

## Test Details

${this.reports.map(test => `
### ${test.testName}

- **Status**: ${test.status.toUpperCase()}
- **Duration**: ${this.formatDuration(test.duration)}
- **Browser**: ${test.browser}
- **Timestamp**: ${test.timestamp}

${test.steps.length > 0 ? `
#### Steps:
${test.steps.map(step => `- ${step.title} - ${step.status} (${this.formatDuration(step.duration)})`).join('\n')}
` : ''}

${test.error ? `
#### Error:
\`\`\`
${test.error}
\`\`\`
` : ''}

---
`).join('')}
`;

    const reportsDir = path.join(process.cwd(), 'reports');
    const markdownPath = path.join(reportsDir, 'custom-report.md');
    fs.writeFileSync(markdownPath, markdown);
    
    this.logger.info(`📝 Markdown report generated: ${markdownPath}`);
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}s ${milliseconds}ms`;
  }
}

export default CustomReporter; 