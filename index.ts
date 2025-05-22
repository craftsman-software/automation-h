import { chromium } from "playwright";
const browser = await chromium.launch({ headless: false }); // headless: false でブラウザを可視化
const page = await browser.newPage();

try {
	// ログインページにアクセス
	await page.goto("https://c16e.v1.herp.cloud"); // 実際のURLに置き換えてください

	// メールアドレス入力
	await page.fill('input[name="email"]', process.env["HERP_EMAIL"]); // メールアドレスを入力

	// パスワード入力
	await page.fill('input[name="password"]', process.env["HERP_PASSWORD"]); // パスワードを入力

	// CSRFトークンの取得（必要に応じて）
	const csrfToken = await page.getAttribute('input[name="_token"]', "value");
	console.log("CSRF Token:", csrfToken);

	// ログインボタンが有効になるまで待機（最大10秒）
	await page.waitForSelector(
		'button[type="submit"].button.--primary.--stretch-md:not([disabled])',
		{ timeout: 10000 },
	);

	// ログインボタンをクリック
	await page.click('button[type="submit"].button.--primary.--stretch-md');

	// ログイン後のページ遷移を待機（例: ダッシュボードページへの遷移）
	await page.waitForURL(/dashboard/, { timeout: 10000 }); // 必要に応じてURLを調整

	console.log("ログイン成功！");
} catch (error) {
	console.error("エラー:", error);
} finally {
	// ブラウザを閉じる
	await browser.close();
}
