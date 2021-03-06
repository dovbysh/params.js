# params.js 0.6.0
# a small library to create a URL by adding and removing params while
# preserving existing params
do ->
  root = exports ? this
  class root.Params
    constructor: (_location)->
      @_location = _location or root.location
      @_search = @_location.search
      @_prefix = @_location.protocol + '//' + @_location.host + @_location.pathname

      @_params = {}
      @_pairs = []
      # setup
      # warn if invalid object
      unless @validate @_search
        #throw "Initializing Params with invalid location.search."
        return false;

      # build _params keys
      @_params = Params.parse @_search

      @_buildPairs()


    # internal setting of a single pair
    _set: (key, value)->
      @_params[key] = value
      @_buildPairs()
      value

    # internal helper method to build an array of pairs
    _buildPairs: ->
      @_pairs = for key of @_params
        if Object.prototype.toString.call(@_params[key]) is "[object Array]"
          (for item of @_params[key]
            "#{key}=#{@_params[key][item]}"
          ).join('&')
        else
          "#{key}=#{@_params[key]}"

    # build the full url, similar to location.href
    href: ->
      @_prefix + @search()

    # build only the params, similar to location.search
    search: ->
      if @_pairs.length
        "?" + @_pairs.join('&')
      else
        ""

    # add data to the params
    # usage:
    # set(key, value)
    # set({
    #   key: value,
    #   anotherKey: anotherValue
    # })
    #
    # returns the params object, so it's chainable
    set: ->
      arg = arguments[0]
      # if a simple pair
      if typeof arg is 'string' or typeof arg is 'number'
        @_set String(arg), arguments[1]


      else if typeof arg is 'object'
        for key of arg
          @_set key, arg[key]
      else
        throw "Unexpected data type for: #{arg}. Should be a string, number, or object"
      @

    # removes a pair
    # returns the params object, so you can chain it
    unset: (key)->
      value = @_params[key]
      delete @_params[key]
      @_buildPairs()
      @

    # an internal array of validations
    # if it passes the validation, it returns true
    _validations: [
      # it's a string
      (string)-> typeof string is 'string'
      # should start with ?
      (string)-> if string.length then string.match(/^\?/) else true,
      # it shouldn't end with &
      (string)-> !string.match(/&$/)
    ]

    # validates the internal params
    # or a string passed to it
    validate: (string) ->

      # innocent until proven guilty
      valid = true

      # try each validation
      for validation in @_validations
        valid = validation(string)
        if not valid
          break

      valid

    get: (key)-> @_params[key]

    # shallow copy the @_params
    object: ->
      obj = {}
      for key of @_params
        obj[key] = @_params[key]
      obj

  # a static method to turn a param string into an object
  root.Params.parse = (paramString)->
    paramObj = {}
    paramArray = []
    if paramString.length > 1
      # build _params keys
      # remove the leading ? character, and split on &
      paramArray = paramString[(1 + paramString.indexOf('?'))...paramString.length].split('&')
      for pair in paramArray
        pair = pair.split '='
        k = pair[0]
        v = pair[1]
        if k of paramObj
          if Object.prototype.toString.call(paramObj[k]) isnt '[object Array]'
            paramObj[k] = [paramObj[k]]
          paramObj[k].push decodeURIComponent v
        else
          paramObj[k] = decodeURIComponent v

    paramObj

