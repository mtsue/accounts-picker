# Accounts Picker

## Description

[ツイプロ](https://twpro.jp/) を使用して、取得したいアカウントにチェックをすると  
右上に Screen Name が表示される。

## How to use

1. ダウンロード

    `git clone https://github.com/mtsue/accounts-picker.git`  

1. Chromeに拡張機能として登録

    * Google Chrome を開き、URLに `chrome://extensions` と入力しアクセスする
    * 右上の デベロッパーモード を有効にする
    * 「パッケージ化されていない拡張機能を読み込む」から、ダウンロードしたディレクトリを選択する

1. スクリーンネームを取得する

    * [ツイプロ](https://twpro.jp/) にアクセスし、プロフィール検索を行う
    * スクリーンネームを取得したいユーザーのチェックボックスにチェックを入れる
    * 右上の「A」のページアクションボタンを押し、「Get ScreenNames」をクリック
    * テキストエリアにスクリーンネームが表示される