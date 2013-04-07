#!/usr/bin/ruby
require "FileUtils"
require 'yaml'
require './_config.rb'

# configuration
CONFIG = Config.new(YAML::load(File.open("config.yml")))

# exceptions
class ProjectPropertyUndefinedError < StandardError
  def initialize(property)
    raise "The property '#{property}' has not been defined!"
  end
end



class ProjectFileUndefinedError < StandardError
  def initialize(file)
    raise "The file '#{file}' does not exist!"
  end
end



# project
class Project
  attr_accessor :name
  attr_accessor :nameSpace
  attr_accessor :buildRoot
  attr_accessor :devRoot
  attr_accessor :prodRoot
  attr_accessor :projectRoot
  attr_accessor :devFile
  attr_accessor :prodFile
  attr_accessor :versionFile
  attr_accessor :devProjectLocationAndDevFile
  attr_accessor :devProjectLocationAndProdFile
  attr_accessor :prodLocationAndProdFile
  attr_accessor :devScriptsLocation
  def initialize(projectName, path)
    @name = projectName
    @nameSpace = CONFIG.nameSpace
    @buildRoot = path.split(CONFIG.buildRoot)[0] + CONFIG.buildRoot
    @devRoot = CONFIG.devRoot
    @prodRoot = CONFIG.prodRoot
    @projectRoot = CONFIG[name].projectRoot
    @devFile = CONFIG[name].devFile
    @prodFile = CONFIG[name].prodFile
    @versionFile = "#{devRoot}/#{projectRoot}/#{CONFIG[name].versionFile}"
    @devProjectLocationAndDevFile = "#{devRoot}/#{projectRoot}/#{devFile}.js"
    @devProjectLocationAndProdFile = "#{devRoot}/#{projectRoot}/#{prodFile}.js"
    @prodLocationAndProdFile = "#{prodRoot}/#{prodFile}.js"
    @devScriptsLocation = "#{devRoot}/#{projectRoot}/scripts"
    #@compressor = "yuicompressor-2.4.6.jar"
    puts "Project '#{name}' was created\n buildRoot: #{buildRoot}\n devRoot: #{devRoot}, prodRoot: #{prodRoot}\n devFile: #{devFile}, prodFile: #{prodFile}\n versionFile: #{versionFile}"
  end

  def deploy
    compileSource
    minifycode
    createProduction
  end

  private

  def setup
    raise ProjectPropertyUndefinedError.new("name") if name.nil?
    raise ProjectPropertyUndefinedError.new("nameSpace") if nameSpace.nil?
    raise ProjectPropertyUndefinedError.new("buildRoot") if buildRoot.nil?
    raise ProjectPropertyUndefinedError.new("devRoot") if devRoot.nil?
    raise ProjectPropertyUndefinedError.new("prodRoot") if prodRoot.nil?
    raise ProjectPropertyUndefinedError.new("projectRoot") if projectRoot.nil?
    raise ProjectPropertyUndefinedError.new("devFile") if devFile.nil?
    raise ProjectPropertyUndefinedError.new("prodFile") if prodFile.nil?
    raise ProjectPropertyUndefinedError.new("versionFile") if versionFile.nil?
    raise ProjectPropertyUndefinedError.new("devProjectLocationAndDevFile") if devProjectLocationAndDevFile.nil?
    raise ProjectPropertyUndefinedError.new("devProjectLocationAndProdFile") if devProjectLocationAndProdFile.nil?
    raise ProjectPropertyUndefinedError.new("prodLocationAndProdFile") if prodLocationAndProdFile.nil?
    raise ProjectPropertyUndefinedError.new("devScriptsLocation") if devScriptsLocation.nil?
    Dir.chdir(buildRoot)
  end

  def getFilesArray
    d = Dir.glob("#{devScriptsLocation}/**/*/") # for directories
    d.unshift("#{devScriptsLocation}/")
    files = []
    d.each do |folder|
      Dir.glob(folder + "*.js").each do |file|
        files.push(file)
      end
    end
    return files
  end

  def getScript
    scripts = []
    getFilesArray.each do |file|
      scripts.push(File.open(file, 'r').readlines)
      scripts.push("\n")
    end
    script = scripts.join
    return script
  end

  def writeProjectToFile
    #script.lines.each do |line|
    #  puts line
    #end
    file= File.new("#{devProjectLocationAndDevFile}", "w")
    file.write(getScript)
    file.close
  end

  def compileSource
    setup

    puts "#{name}: compiling js"
    writeProjectToFile
    # FileUtils.move("#{devRoot}/js/#{devFile}.js", "#{devRoot}/js/#{devFile}-min.js")
    #`compass compile #{devRoot} "#{devRoot}/sass/#{devFile}.sass" -s nested --force`

    #puts "#{devRoot}/#{name}/#{prodFile}.js"
    #puts "#{devRoot}/#{devFile}.js"
    #puts buildRoot
    #`java -jar #{buildRoot}/build/yuicompressor-2.4.6.jar #{devRoot}/#{devFile}.js -o #{devRoot}/#{name}/#{prodFile}.js`
    #`compass compile #{devRoot} "#{devRoot}/sass/#{devFile}.sass" -s compressed --force`

  rescue ProjectPropertyUndefinedError
    return
  end

  def minifycode
    setup
    puts "#{name}: minifying code"
    `java -jar #{buildRoot}/build/yuicompressor-2.4.6.jar #{devProjectLocationAndDevFile} -o #{prodLocationAndProdFile}`
  rescue ProjectPropertyUndefinedError
    return
  end
  def updateAndGetVersion
    raise ProjectFileUndefinedError.new(versionFile) if !File.exists?(versionFile)
    version = File.open(versionFile, "r").readlines[0].chomp.split(",")
    version[2] = Integer(version[2]) + 1
    aFile = File.new(versionFile, "w")
    aFile.write(version.join(","))
    aFile.close
    
    version = version.join(".")
    puts "#{name}: updating version to #{version}"
    return version
  end
  
  def createProduction
    setup
    devMinFile = "#{prodLocationAndProdFile}"
    version = updateAndGetVersion

    puts "#{name}: creating production"
    file = File.open(devMinFile, 'r').readlines
    file.insert(0, "/* #{nameSpace}-#{name}-min r v.#{version} */")

    #Dir.chdir("#{prodRoot}")
    aFile = File.new("#{prodLocationAndProdFile}", "w")
    aFile.write(file.join())
    aFile.close

  rescue ProjectPropertyUndefinedError
    return
  rescue ProjectFileUndefinedError
    return
  end
  
end
