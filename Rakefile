# http://oxlade39.github.io/blogging/2012/04/20/Jekyll,-Github,-Plugins-and-automated-deployment.html
desc 'Delete generated _site files'
task :clean do
  system "rm -fR _site2"
  system "git submodule update"
  system "cd _site && git checkout master . && git clean -d -f"
end

desc 'Run the jekyll dev server'
task :server do
  system "jekyll --server"
end

desc 'Clean temporary files and run the server'
task :compile => :clean do
  system "jekyll"
end

desc 'generate the jekyll site and then copy to staging area'
task :generate => :compile do
  system "cp -R _site2/* _site/"
  system "rm -R _site2"
end

desc 'commit and push to github'
task :deploy, [:commit_message] => :generate do |t, args|
  if args.commit_message
    puts "Committing and pushing with commit message: #{args.commit_message}"
    system "cd _site && git add . && git commit -m \"#{args.commit_message}\" && git push"
    system "git add _site"
    system "git co -m \"updating submodule reference to master\""
  else
    puts "Missing commit_message"
  end
end


# https://gist.github.com/stammy/792958
desc 'create new post or bit. args: type (post, bit), title, future (# of days)'
# rake new type=(bit|post) future=0 title="New post title goes here" slug="slug-override-title"
task :new do
  require 'rubygems'
  require 'chronic'
  
  type = ENV["type"] || "post"
  title = ENV["title"] || "New Title"
  future = ENV["future"] || 0
  slug = ENV["slug"].gsub(' ','-').downcase || title.gsub(' ','-').downcase
 
  # if type == "bit"
  #   TARGET_DIR = "_bits"
  # elsif future.to_i < 3
  #   TARGET_DIR = "_posts"
  # else
  #   TARGET_DIR = "_drafts"
  # end
 
  if future.to_i.zero?
    filename = "#{Time.new.strftime('%Y-%m-%d')}-#{slug}.markdown"
  else
    stamp = Chronic.parse("in #{future} days").strftime('%Y-%m-%d')
    filename = "#{stamp}-#{slug}.markdown"
  end
  path = File.join(TARGET_DIR, filename)
  post = <<-HTML
--- 
layout: TYPE
title: "TITLE"
date: DATE
---
 
HTML
  post.gsub!('TITLE', title).gsub!('DATE', Time.new.to_s).gsub!('TYPE', type)
  File.open(path, 'w') do |file|
    file.puts post
  end
  puts "new #{type} generated in #{path}"
  # system "open -a textmate #{path}"
end
