const { expect, test } = require("@playwright/test");
const pageUrl = 'http://localhost:3000/login';

test('Verify "All Books" link is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector('#site-header > nav');
    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
    await expect(isAllBooksLinkVisible).toBe(true);
});

test('Verify Login button is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector('#site-header > nav');
    const loginButton = await page.$('a[href="/login"]');
    const isLoginButtinVisible = await loginButton.isVisible();
    await expect(isLoginButtinVisible).toBe(true);
});

test('Verify Register button is visible', async ({ page }) => {
    await page.goto(pageUrl);
    await page.waitForSelector('#site-header > nav');
    const registerButton = await page.$('a[href="/register"]');
    const isRegisterButtinVisible = await registerButton.isVisible();
    await expect(isRegisterButtinVisible).toBe(true);
});

test('Verify "All Books" link is visible after user login', async ({ page }) => {
    await page.goto(pageUrl);
  
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');
  
    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
  
    await expect(isAllBooksLinkVisible).toBe(true);
  });
  
  test('Login with valid credentials', async ({ page }) => {
    await page.goto(pageUrl);
  
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
  
    await page.click('input[type="submit"]');
  
    await page.$('a[href="/catalog"]');
    await expect(page.url()).toBe('http://localhost:3000/catalog');
  });
  
  test('Login with empty input fields', async ({ page }) => {
    await page.goto(pageUrl);
    await page.click('input[type="submit"]');
  
    page.on('dialog', async dialog => {
        await expect(dialog.type()).toContain('alert');   
        await expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
      });
  
      await page.$('a[href="/login"]');
      await expect(page.url()).toBe('http://localhost:3000/login');
  });
  
  test('Add book with correct data', async ({ page }) => {
    await page.goto(pageUrl);
  
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
  
    await Promise.all([
      page.click('input[type="submit"]'), 
      page.waitForURL('http://localhost:3000/catalog')
    ]);
  
    await page.click('a[href="/create"]');
  
    await page.waitForSelector('#create-form');
  
    await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'https://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
  
    await page.click('#create-form input[type="submit"]');
  
    await page.waitForURL('http://localhost:3000/catalog');
  
    await expect(page.url()).toBe('http://localhost:3000/catalog');
  });
  
  test('Add book with empty title field', async ({ page }) => {
    await page.goto(pageUrl);
  
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
  
    await Promise.all([
      page.click('input[type="submit"]'), 
      page.waitForURL('http://localhost:3000/catalog')
    ]);
  
    await page.click('a[href="/create"]');
  
    await page.waitForSelector('#create-form');
  
    await page.fill('#description', 'This is a test book description');
    await page.fill('#image', 'https://example.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
  
    await page.click('#create-form input[type="submit"]');
  
    page.on('dialog', async dialog => {
      await expect(dialog.type()).toContain('alert');   
      await expect(dialog.message()).toContain('All fields are required!');
      await dialog.accept();
    });
  
    await page.$('a[href="/create"]');
    await expect(page.url()).toBe('http://localhost:3000/create');
  });
  
  test('Login and verify all books are displayed', async ({ page }) => {
    await page.goto(pageUrl);
  
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
  
    await Promise.all([
      page.click('input[type="submit"]'), 
      page.waitForURL('http://localhost:3000/catalog') 
    ]);
  
    await page.waitForSelector('.dashboard');
  
    const bookElements = await page.$$('.other-books-list li');
  
    await expect(bookElements.length).toBeGreaterThan(0);
  });
  
  test('Login and navigate to Details page', async ({ page }) => {
    await page.goto(pageUrl);
  
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
  
    await Promise.all([
      page.click('input[type="submit"]'), 
      page.waitForURL('http://localhost:3000/catalog')
    ]);
  
    await page.click('a[href="/catalog"]');
  
    await page.waitForSelector('.otherBooks');
  
    await page.click('.otherBooks a.button');
  
    await page.waitForSelector('.book-information');
  
    const detailsPageTitle = await page.textContent('.book-information h3');
    await expect(detailsPageTitle).toBe('Test Book'); 
  });
  
  test('Verify visibility of Logout button after user login', async ({ page }) => {
    await page.goto(pageUrl);
  
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');
  
    const logoutLink = await page.$('a[href="javascript:void(0)"]');
  
    const isLogoutLinkVisible = await logoutLink.isVisible();
  
    await expect(isLogoutLinkVisible).toBe(true);
  });
  
  test('Verify redirection of Logout link after user login', async ({ page }) => {
    await page.goto(pageUrl);
  
    await page.fill('input[name="email"]', 'peter@abv.bg');
    await page.fill('input[name="password"]', '123456');
    await page.click('input[type="submit"]');
  
    const logoutLink = await page.$('a[href="javascript:void(0)"]');
    await logoutLink.click();
  
    const redirectedURL = page.url();
    await expect(redirectedURL).toBe('http://localhost:3000/catalog');
  });