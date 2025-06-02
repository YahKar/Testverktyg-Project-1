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
        /*
        // 4. Confirm the user appears
        await expect(page.locator('body')).toContainText('@Patrik');
        */

        // 5. Click the delete button
        const userLi = page.locator('li').filter({ hasText: '@Patrik' }).first();
        await expect(userLi).toBeVisible();
        //const deleteButton = userLi.locator('form button[type="submit"]');

        // 3. Click delete and wait for redirect
        await Promise.all([
            page.waitForNavigation({ url: '**/users' }),
            userLi.locator('form button[type="submit"]').click()
    ]);

        await page.waitForTimeout(1000); // wait 1 second

        // Confirm the user is no longer present
        await page.reload(); // Reload after deletion
            // 5. Make sure the user is really gone
    await expect(page.locator('li', { hasText: '@Patrik' })).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText('@Patrik');
    });
})

