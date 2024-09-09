require 'octokit'
require 'dotenv'

# .envファイルから環境変数を読み込む（オプション）
Dotenv.load

# GitHub Personal Access Tokenを環境変数から取得
github_token = ENV['GITHUB_TOKEN']

if github_token.nil? || github_token.empty?
  puts 'GitHub Personal Access Tokenが設定されていません。'
  puts 'GITHUB_TOKEN環境変数を設定してください。'
  exit 1
end

# Octokitクライアントの初期化
client = Octokit::Client.new(access_token: github_token)

# 更新するGistのID
gist_id = 'b81e4b71f3ea280278ef532ec6a1c781'


# Gistの更新
files = {
  'sado_1.csv' => 'combined_table_data_1.csv',
  'sado_2.csv' => 'combined_table_data_2.csv',
  'sado_3.csv' => 'combined_table_data_3.csv',
  'sado_4.csv' => 'combined_table_data_4.csv'
}

files.each do |new_filename, old_filename|
  files[new_filename] = { content: File.read(old_filename) }
end

client.edit_gist(gist_id, { files: files })

puts 'Gistが正常に更新されました。'
