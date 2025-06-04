process.env.NODE_ENV = 'test'; // Force test environment 

const { test, expect } = require('@playwright/test');
const { clearTestUsers } = require('./test-setup');
require('dotenv').config({ path: '.env.test' });


// To clear up before each test
test.beforeEach(async () => {
    await clearTestUsers();
});


test.describe('Test User', () => {      
 // create a new user
    test('Should create a new user', async ({ page }) => {
        await page.goto('http://localhost:1500/create');
        await page.waitForSelector('input[name="Name"]');
        await page.fill('input[name="Name"]', 'Ratna');
        await page.fill('input[name="Nickname"]', 'Sri');
        await page.fill('input[name="Age"]', '32');
        await page.fill('textarea[name="Bio"]', 'Tester');

        await page.click('button[type="submit"]');
        await page.waitForURL('**/users');
        await expect(page.locator('body')).toContainText('Ratna');
    });

    // Edit a user
    test('Should edit an existing user', async ({ page }) => {
        await page.goto('http://localhost:1500/create');

        await page.waitForSelector('input[name="Name"]');
        await page.fill('input[name="Name"]', 'Durga');
        await page.fill('input[name="Nickname"]', 'Divya');
        await page.fill('input[name="Age"]', '32');
        await page.fill('textarea[name="Bio"]', 'Tester');
        
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation()
        ]);
      
        await expect(page.locator('body')).toContainText('@Durga');

        await page.locator("text=@Durga").first().click();  
        await page.waitForURL('**/users/**');     

        // Capture the user ID from the URL
        const userDetailUrl = page.url();
        const userId = userDetailUrl.split('/').pop();


         // Step 3: Click "Edit" and go to the edit form
        await page.waitForSelector('text=Edit');
        await page.locator('text=Edit').click();
        await page.waitForURL('**/edit');

        await page.waitForSelector('input[name="Name"]')
        await page.fill('input[name="Name"]', 'Chery ');
        await page.fill('input[name="Nickname"]', 'Cha');
        await page.fill('input[name="Age"]', '30');
        await page.fill('textarea[name="Bio"]', 'Python, JS, HTML.');


        // 5. Submit the edit form
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation()
        ]);

       // Go back to updated user detail page using the same ID
        await page.goto(`http://localhost:1500/users/${userId}`);
        await expect(page.locator('body')).toContainText('Python, JS, HTML.');
        await expect(page.locator('body')).toContainText('@Chery');
        
    });

      // Delete a user
    test('Should delete a user by name', async ({ page }) => {
        // Create a new user.
        await page.goto('http://localhost:1500/create');

        await page.fill('input[name="Name"]', 'Patrik');
        await page.fill('input[name="Nickname"]', 'Pat');
        await page.fill('input[name="Age"]', '39');
        await page.fill('textarea[name="Bio"]', 'Teacher');
        await page.click('button[type="submit"]');

        // Redirect to all users after creating a user.            
        await page.waitForURL('**/users');      
        
        // Check user created or not with name 
        await expect(page.locator('body')).toContainText('@Patrik');

        // Find edit button href link of the created user and click on the name. 
        const userLi = page.locator('li').filter({ hasText: '@Patrik' }).first();
        // Accept user confirmation to delete the user.
        page.on('dialog', dialog => dialog.accept()); 

        // Submit the form and wait for the users page to load                       
        const deleteButton = userLi.locator('form button[type="submit"]');        
        await deleteButton.click();

       //Make sure the user is really gone
        await page.reload();
        await expect(page.locator('body')).not.toContainText('@Patrik');
    });


    // Display user details 
    test('Should display user details', async ({ page }) => {
        await page.goto('http://localhost:1500/create');
        await page.waitForSelector('input[name="Name"]');
        await page.fill('input[name="Name"]', 'Lakshmi');
        await page.fill('input[name="Nickname"]', 'Sri');
        await page.fill('input[name="Age"]', '32');
        await page.fill('textarea[name="Bio"]', 'Tester with playwright exp');

        await page.click('button[type="submit"]');
        await page.waitForURL('**/users');  

        await expect(page.locator('body')).toContainText('@Lakshmi');      
        await page.locator("text=@Lakshmi").first().click();
        await page.waitForURL('**/users/**'); 
        await expect(page.locator('body')).toContainText('Tester with playwright exp');
    });
    
});