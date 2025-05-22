import { chromium } from "playwright";
import { env } from "bun";
const browser = await chromium.launch({ headless: false }); // headless: false でブラウザを可視化
const page = await browser.newPage();

try {
	// .envファイルから環境変数を読み込む（Bunは自動的に.envを読み込みます）
	console.log("環境変数を読み込みました");

	// TODO: YAMLデータを読み込む

	// ログインページにアクセス
	await page.goto("https://c16e.v1.herp.cloud"); // 実際のURLに置き換えてください

	// メールアドレス入力
	const email = process.env.HERP_EMAIL;
	if (!email) {
		throw new Error("環境変数 HERP_EMAIL が設定されていません");
	}
	await page.fill('input[name="email"]', email); // メールアドレスを入力

	// パスワード入力
	const password = process.env.HERP_PASSWORD;
	if (!password) {
		throw new Error("環境変数 HERP_PASSWORD が設定されていません");
	}
	await page.fill('input[name="password"]', password); // パスワードを入力

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

	// 求人作成ページに遷移
	console.log("求人作成ページに遷移します...");
	await page.goto("https://c16e.v1.herp.cloud/ats/p/requisitions/add");
	console.log("求人作成ページに遷移しました");

	// 「新しく職種を作成する」が見えていることを確認
	console.log("「新しく職種を作成する」テキストを確認中...");
	await page.waitForSelector("text=新しく職種を作成する", { timeout: 10000 });
	console.log("「新しく職種を作成する」テキストが確認できました");

	// 職種名フィールドに入力
	console.log("職種名を入力中...");
	const jobTitleInput = await page.locator(
		'.text-field__input[placeholder="例) UXデザイナー"]',
	);
	await jobTitleInput.fill("職種名のサンプルデータ");
	console.log("職種名を入力しました");

	// 「作成して詳細設定に進む」ボタンが有効になるまで待機
	console.log("「作成して詳細設定に進む」ボタンが有効になるのを待機中...");
	await page.waitForSelector(
		"button.button.event-click-add-requisition.--primary.--stretch-md:not([disabled])",
		{ timeout: 10000 },
	);

	// 「作成して詳細設定に進む」ボタンをクリック
	console.log("「作成して詳細設定に進む」ボタンをクリック中...");
	await page.click(
		"button.button.event-click-add-requisition.--primary.--stretch-md",
	);
	console.log("「作成して詳細設定に進む」ボタンをクリックしました");

	// 「職種に関する設定」が見えていることを確認
	console.log("「職種に関する設定」テキストを確認中...");
	await page.waitForSelector("text=職種に関する設定", { timeout: 10000 });
	console.log("「職種に関する設定」テキストが確認できました");

	// 仕事概要フォームに「hoge」と入力
	console.log("仕事概要フォームに入力中...");

	// <div class="labeled-form-item"><label class="labeled-form-item__label --optional">仕事概要</label><div class="labeled-form-item__description"></div><div class="labeled-form-item__item"><div class="multiline-text-field"><textarea class="multiline-text-field__input" placeholder="AIリクルーティングプラットフォームHERPのUX/UIデザインをお任せします。企画・リサーチ段階から、ユーザインタビュー、エンジニア・ビジネス側のメンバーとディスカッション等を通じて、ユーザにとって本当に役に立つプロダクトをつくりあげる仕事です。 " rows="6" data-mobile-enabled="false"></textarea><ul class="multiline-text-field__messages"></ul></div></div><!--undefined--></div>
	const jobDescriptionTextarea = page.locator(
		'div.labeled-form-item:has(label:has-text("仕事概要")) textarea'
	);
	await jobDescriptionTextarea.fill("仕事概要のサンプルデータ");
	console.log("仕事概要フォームに「hoge」と入力しました");

	// 保存ボタンをクリック
	console.log("「保存する」ボタンをクリック中...");
	await page.click('button.button.--primary[type="submit"]');
	console.log("「保存する」ボタンをクリックしました");

	// 保存完了を待機
	await page.waitForTimeout(2000);
	console.log("求人情報の作成が完了しました");
} catch (error) {
	console.error("エラー:", error);
} finally {
	// ブラウザを閉じる
	await browser.close();
}
