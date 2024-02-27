const { test, expect } = require('@playwright/test');

test.describe('React View BDD Tests', () => {

    // Test with an existing image and default form values
    test('submit analysis with an existing image and default values', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.setInputFiles('#dataSource', 'path/to/test-image.png');
        await page.click('button >> text=Analyze');
        await expect(page.locator('text=Labels')).toBeVisible();
    });

    // Test with a non-existing image (simulate by not setting an image)
    test('attempt to submit form without an image', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.click('button >> text=Analyze');
        await expect(page.locator('text=Please select a file')).toBeVisible();
    });

    test('attempt to upload a non-existent file', async ({ page }) => {
        await page.goto('http://localhost:3000');

        const fileInput = await page.locator('input[type="file"]');
        await fileInput.setInputFiles('/path/to/nonexistent/file.png');
        await page.click('#submit-button');
        await expect(page.locator('text=Please select a file')).toBeVisible();
    });

    // Test submitting the form with changed values
    test('submit form with changed values for maxLabel and minConfidence', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.setInputFiles('#dataSource', 'path/to/test-image.png');
        await page.fill('#maxLabel', '5');
        await page.fill('#minConfidence', '80');
        await page.click('button >> text=Analyze');
        await expect(page.locator('text=Labels')).toBeVisible();
    });

    test('change application language', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.selectOption('#languageSelector', { label: 'French' });
        await expect(page.locator('text=Analyser')).toBeVisible();
    });

    test('should store language preference in localStorage', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.click('#language-switch');
        await page.click('text=French');

        const language = await page.evaluate(() => localStorage.getItem('language'));
        expect(language).toBe('fr');
    });
});
