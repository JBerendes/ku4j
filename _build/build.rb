#!/usr/bin/ruby
require "./_project.rb"

ARGV.each do |project|
  myProject = Project.new(project, Dir.pwd)
  myProject.deploy
end

#ARGV.each do |a|
  #writeProjectToFile(a)
#end