require 'octokit'
require 'dotenv'

# .envファイルから環境変数を読み込む（オプション）
Dotenv.load

# GitHub Personal Access Tokenを環境変数から取得
github_token = ENV['GITHUB_TOKEN']

if github_token.nil? || github_token.empty?
  puts "GitHub Personal Access Tokenが設定されていません。"
  puts "GITHUB_TOKEN環境変数を設定してください。"
  exit 1
end

# Octokitクライアントの初期化
client = Octokit::Client.new(access_token: github_token)

# 更新するGistのID
gist_id = 'b81e4b71f3ea280278ef532ec6a1c781'

# 更新するファイル名
filename = 'combined_table_data.csv'

begin
  # ファイルの内容を読み込む
  file_content = File.read(filename)

  # Gistの更新
  gist = client.edit_gist(gist_id, {
    files: {
      'sado.csv' => { content: file_content }
    }
  })

  puts "Gistが正常に更新されました。"
  puts "更新されたGistのURL: #{gist.html_url}"
rescue Octokit::Error => e
  puts "GitHubとの通信中にエラーが発生しました: #{e.message}"
rescue Errno::ENOENT
  puts "ファイル '#{filename}' が見つかりません。"
rescue => e
  puts "予期せぬエラーが発生しました: #{e.message}"
end

