# encoding: utf-8

require 'helper'
require 'inspec/resource'

describe 'Inspec::Resources::YAML' do
  describe 'when loading a valid yaml' do
    let (:resource) { load_resource('yaml', 'kitchen.yml') }

    it 'gets params as a hashmap' do
      _(resource.params).must_be_kind_of Hash
    end

    it 'retrieves nil if a param is missing' do
      _(resource.params['missing']).must_be_nil
    end

    it 'retrieves params by name' do
      _(resource.send('name')).must_equal 'vagrant'
    end

    it 'retrieves an array by name' do
      _(resource.send('platforms')).must_equal %w{linux mac}
    end

    it 'doesnt resolve dot-notation names' do
      _(resource.send('driver.customize.memory')).must_be_nil
    end

    it 'doesnt resolve symbol-notation names' do
      _(resource.send(:'driver.customize.memory')).must_be_nil
    end
  end
end