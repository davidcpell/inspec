# encoding: utf-8
require 'train'
require 'yaml'
require 'json'
# require 'github/markup'

# Load all commands
counter = 0
tutorial_file = 'www/tutorial/tutorial.yml'
tutorial_commands = YAML.load(File.read(tutorial_file))['demos'].map { |x| x['desc'] }.map { |x| x.scan(/```(.*?)```/m) }.flatten.map(&:strip).map { |x| x.split("\n") }.flatten
tutorial_instructions = YAML.load(File.read(tutorial_file))['demos'].map { |x| [counter += 1, x['desc']] }

commands_file = 'www/tutorial/commands.yml'
extra_commands = YAML.load(File.read(commands_file))['commands']

# Pull out shell commands from tutorial
no_shell_tutorial_commands = tutorial_commands.take(20)
shell_tutorial_commands = tutorial_commands.drop(20)

# TEMPORARY: Pull out describe and control blocks, as well as two commands before them
# I'm having trouble with the ' in those commands
simple_shell_commands = shell_tutorial_commands.take(5)
shell_commands = simple_shell_commands.map { |x| 'echo ' + x + ' | inspec shell' }

# Merge the output
commands = no_shell_tutorial_commands + extra_commands + shell_commands

# TEMPORARY: REMOVE SSH COMMANDS (-t & -b)
commands.delete_if { |x| x.include? '-t' }
commands.delete_if { |x| x.include? '-b' }

# Create commands.json file
commands_file = File.new('www/tutorial/commands.json', 'w')
json = commands.map { |x| [ x => (x.tr('/', '_') + '.txt') ] }.to_json
commands_file.write(json)
puts 'Wrote www/tutorial/commands.json'

# Create instructions.json file
instructions_file = File.new('www/tutorial/instructions.json', 'w')
instructions_file.write(tutorial_instructions.to_json)
puts 'Wrote www/tutorial/instructions.json'

# Generate command results files
# Create Train connection
backend = Train.create('local')
conn = backend.connection

# Loop over commands
commands.each do |command|
  cmd = conn.run_command(command)
  cmd.stdout

  # save the result and put it in inspec/www/app/results with command as filename
  result = cmd.stdout
  dir = 'www/tutorial/app/responses/'

  # replace "/" with "_"
  key = command.tr('/', '_')

  filename = File.join(dir, "#{key}.txt")
  out_file = File.new(filename, 'w')
  result.lines.each do |line|
    line_to_write = "#{line.chomp}\r\n"
    out_file.write(line_to_write)
  end
  out_file.close
  puts "Wrote #{filename}"
end

conn.close
