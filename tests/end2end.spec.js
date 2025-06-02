process.env.NODE_ENV = 'test'; // Force test environment 

const { test, expect } = require('@playwright/test');
const { clearTestUsers } = require('./test-setup');
require('dotenv').config({ path: '.env.test' });

// To clear up before each test
test.beforeEach(async () => {
    await clearTestUsers();
});


test.describe('Test User', () => {

    // Visit users page and check list 
    test('Show a list of users', async ({ page }) => {
        await page.goto('http://localhost:1500/users');
        await expect(page.locator('body')).toContainText('Chama')
        await expect(page.locator('body')).toContainText('Ratnasri');
    });

    // create a new user
    test('Should create a new user', async ({ page }) => {
        await page.goto('http://localhost:1500/create');
        await page.waitForSelector('input[name="Name"]');
        await page.fill('input[name="Name"]', 'Durga');
        await page.fill('input[name="Nickname"]', 'Divya');
        await page.fill('input[name="Age"]', '32');
        await page.fill('textarea[name="Bio"]', 'Tester');

        await page.click('button[type="submit"]');
        await page.waitForURL('**/users');

        await expect(page.locator('body')).toContainText('Durga');
    });

    // View user details
    test('Should display user details', async ({ page }) => {
        await page.goto('http://localhost:1500/users/1');
        await expect(page.locator('body')).toContainText('Chama');
        await expect(page.locator('body')).toContainText('Chachou');
    });

    // Edit a user
    test('Should edit an existing user', async ({ page }) => {
        await page.goto('http://localhost:1500/users/1/edit');

        await page.waitForSelector('input[name="Name"]')
        await page.fill('input[name="Name"]', 'Chama Hakkal');
        await page.fill('input[name="Nickname"]', 'Chachou');
        await page.fill('input[name="Age"]', '34');
        await page.fill('textarea[name="Bio"]', 'Python, JS, HTML.');

        await page.click('button[type="submit"]');

        await page.waitForURL('**/users/1');

       //  await expect(page.locator('body')).toContainText('Chama Hakkal!');
       // await expect(page.locator('body')).toContainText('Chachou');
       // await expect(page.locator('body')).toContainText('34');
        await expect(page.locator('body')).toContainText('Python, JS, HTML.');
    });

    // Delete a user
    test('Should delete a user', async ({ page }) => {

        // Go first to the create page 
        await page.goto('http://localhost:1500/create');

        // Fill the create form
        await page.fill('input[name="Name"]', 'Patrik');
        await page.fill('input[name="Nickname"]', 'Pat');
        await page.fill('input[name="Age"]', '39');
        await page.fill('textarea[name="Bio"]', 'Teacher');

        
        // Submit the form and wait for the users page to load
        await Promise.all([
            page.waitForURL('**/users'),
            page.click('button[type="submit"]')
        ]);
        await expect(page.locator('body')).toContainText('@Patrik');

        // 2. Confirm user appears
        const userLi = page.locator('li', { hasText: '@Patrik' }).first();
        await expect(userLi).toBeVisible();

        // 3. Delete the user
        await Promise.all([
            page.waitForNavigation({ url: '**/users' }), // Wait for redirect
            userLi.locator('form button[type="submit"]').click(),
        ]);

            // 5. Make sure the user is really gone
        await expect(page.locator('body')).not.toContainText('@Patrik');
    });
})

