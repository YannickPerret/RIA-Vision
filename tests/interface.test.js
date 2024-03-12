import { test, expect } from '@playwright/test';

test.describe('React View BDD Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('submit analysis with an existing image and default values', async ({ page }) => {
        await page.setInputFiles('#fileUpload', 'tests/images/valid.jpg');
        await page.fill('#maxLabel', '10');
        await page.fill('#minConfidence', '70');
        await page.click('#analyzeButton');
        await page.waitForSelector('#labels');
        await expect(page.locator('#labels')).toBeVisible();
    });

    test('attempt to submit form without an image', async ({ page }) => {
        await page.click('#analyzeButton');
        await page.waitForSelector('#error');
        const color = await page.evaluate(() => window.getComputedStyle(document.querySelector('#error')).color);
        expect(color).toBe('rgb(255, 0, 0)');
        await expect(page.locator('#error')).toBeVisible();
    });

    test('attempt to upload a non-image file', async ({ page }) => {
        await page.setInputFiles('#fileUpload', 'tests/images/test-document.txt');
        await page.click('#analyzeButton');
        await page.waitForSelector('#error');
        const color = await page.evaluate(() => window.getComputedStyle(document.querySelector('#error')).color);
        expect(color).toBe('rgb(255, 0, 0)');
        await expect(page.locator('#error')).toBeVisible();
    });

    test('attempt to upload an incorrect image file', async ({ page }) => {
        await page.setInputFiles('#fileUpload', 'tests/images/invalid.jpg');
        await page.click('#analyzeButton');
        await page.waitForSelector('#error');
        const color = await page.evaluate(() => window.getComputedStyle(document.querySelector('#error')).color);
        expect(color).toBe('rgb(255, 0, 0)');
        await expect(page.locator('#error')).toBeVisible();
    });
});

test.describe('Form Submission Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('submit form with non-conform minConfidence value', async ({ page }) => {
        await page.setInputFiles('#fileUpload', 'tests/images/valid.jpg');
        await page.fill('#maxLabel', '10');
        await page.fill('#minConfidence', '101');
        await page.click('#analyzeButton');
        await page.waitForSelector('text=minConfidence must be between 0 and 100');
        await expect(page.locator('text=minConfidence must be between 0 and 100')).toBeVisible();
    });

    test('submit form with changed values for maxLabel and minConfidence', async ({ page }) => {
        await page.setInputFiles('#fileUpload', 'tests/images/valid.jpg');
        await page.fill('#maxLabel', '5');
        await page.fill('#minConfidence', '80');
        await page.click('#analyzeButton');
        await page.waitForSelector('#labels');
        await expect(page.locator('#labels')).toBeVisible();
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
