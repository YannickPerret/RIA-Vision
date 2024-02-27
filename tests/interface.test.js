import { test, expect } from '@playwright/test';

test.describe('React View BDD Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('submit analysis with an existing image and default values', async ({ page }) => {
        await page.setInputFiles('input[type="file"]', 'tests/images/valid.jpg');
        await page.click('button >> text=Analyze');
        await page.waitForSelector('text=Labels');
        await expect(page.locator('text=Labels')).toBeVisible();
    });

    test('attempt to submit form without an image', async ({ page }) => {
        await page.click('button >> text=Analyze');
        await page.waitForSelector('text=Please select a file');
        await expect(page.locator('text=Please select a file')).toBeVisible();
    });

    test('attempt to upload a non-image file', async ({ page }) => {
        await page.setInputFiles('input[type="file"]', 'tests/images/test-document.txt');
        await page.click('button >> text=Analyze');
        await page.waitForSelector('text=Invalid file type');
        await expect(page.locator('text=Invalid file type')).toBeVisible();
    });

    test('attempt to upload an wrong image file', async ({ page }) => {
        await page.setInputFiles('input[type="file"]', 'tests/images/invalid.jpg');
        await page.click('button >> text=Analyze');
        await page.waitForSelector('text=Invalid image');
        await expect(page.locator('text=Invalid image')).toBeVisible();
    });
});

test.describe('Form Submission Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('submit form with non-conform minConfidence value', async ({ page }) => {
        await page.setInputFiles('input[type="file"]', 'tests/images/valid.jpg');
        await page.fill('#maxLabel', '10');
        await page.fill('#minConfidence', '101');
        await page.click('button >> text=Analyze');
        await page.waitForSelector('text=Error Message for minConfidence');
        await expect(page.locator('text=Error Message for minConfidence')).toBeVisible();
    });

    test('submit form with changed values for maxLabel and minConfidence', async ({ page }) => {
        await page.setInputFiles('input[type="file"]', 'tests/images/valid.jpg');
        await page.fill('#maxLabel', '5');
        await page.fill('#minConfidence', '80');
        await page.click('button >> text=Analyze');
        await page.waitForSelector('text=Labels');
        await expect(page.locator('text=Labels')).toBeVisible();
    });
});

test.describe('Language Selection Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('change application language', async ({ page }) => {
        await page.selectOption('#language', 'fr');
        await page.waitForSelector('text=Analyser');
        await expect(page.locator('text=Analyser')).toBeVisible();
    });

    test('should store language preference in localStorage', async ({ page }) => {
        await page.selectOption('#language', 'fr');
        const language = await page.evaluate(() => localStorage.getItem('language'));
        expect(language).toBe('fr');
    });
});