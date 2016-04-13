(function() {
  var BlockNode, DecoratorNode, EscapedVariableNode, Handlebar, Identifier, IndentedNode, InlineNode, InvertedSectionNode, JsonNode, LeafNode, Line, NodeCollection, ParseException, PartialNode, RenderResult, RenderState, SectionNode, StringBuilder, StringNode, Token, TokenStream, UnescapedVariableNode, VertedSectionNode, endsWith, extend, startsWith;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  startsWith = function(string, prefix) {
    return string.slice(0, prefix.length) === prefix;
  };

  endsWith = function(string, suffix) {
    return string.slice(string.length - suffix.length) === suffix;
  };

  extend = function(array, extendWith) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = extendWith.length; _i < _len; _i++) {
      item = extendWith[_i];
      _results.push(array.push(item));
    }
    return _results;
  };

  ParseException = (function() {

    __extends(ParseException, Error);

    function ParseException(error, line) {
      ParseException.__super__.constructor.call(this, error + " (line " + line + ")");
    }

    return ParseException;

  })();

  RenderResult = (function() {

    function RenderResult(text, errors) {
      this.text = text;
      this.errors = errors;
    }

    RenderResult.prototype.appendTo = function(element) {
      var tempElement, _results;
      tempElement = document.createElement(element.tagName);
      tempElement.innerHTML = this.text;
      _results = [];
      while (tempElement.childNodes.length > 0) {
        _results.push(element.appendChild(tempElement.firstChild));
      }
      return _results;
    };

    RenderResult.prototype.insertBefore = function(element) {
      var parent, tempElement, _results;
      parent = element.parentElement;
      tempElement = document.createElement(parent.tagName);
      tempElement.innerHTML = this.text;
      _results = [];
      while (tempElement.childNodes.length > 0) {
        _results.push(parent.insertBefore(tempElement.firstChild, element));
      }
      return _results;
    };

    return RenderResult;

  })();

  StringBuilder = (function() {

    function StringBuilder() {
      this._buffer = [];
      this.length = 0;
    }

    StringBuilder.prototype.append = function(s) {
      var string;
      string = s.toString();
      this._buffer.push(string);
      return this.length += string.length;
    };

    StringBuilder.prototype.toString = function() {
      return this._buffer.join('');
    };

    return StringBuilder;

  })();

  RenderState = (function() {

    function RenderState(globalContexts, localContexts) {
      this.globalContexts = globalContexts;
      this.localContexts = localContexts;
      this.text = new StringBuilder();
      this.errors = [];
      this._errorsDisabled = false;
    }

    RenderState.prototype.inSameContext = function() {
      return new RenderState(this.globalContexts, this.localContexts);
    };

    RenderState.prototype.getFirstContext = function() {
      if (this.localContexts.length > 0) return this.localContexts[0];
      if (this.globalContexts.length > 0) return this.globalContexts[0];
      return null;
    };

    RenderState.prototype.disableErrors = function() {
      this._errorsDisabled = true;
      return this;
    };

    RenderState.prototype.addError = function() {
      var buf, message, messages, _i, _len;
      messages = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this._errorsDisabled) return this;
      buf = new StringBuilder();
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        message = messages[_i];
        buf.append(message);
      }
      this.errors.push(buf.toString());
      return this;
    };

    RenderState.prototype.getResult = function() {
      return new RenderResult(this.text.toString(), this.errors);
    };

    RenderState.prototype.toString = function() {
      var listToString;
      listToString = function(list) {
        var buf, e, is_first, _i, _len;
        if (list.length === 0) return "[]";
        buf = new StringBuilder();
        buf.append("[");
        is_first = true;
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          e = list[_i];
          if (!is_first) {
            buf.append(",");
            is_first = false;
          }
          buf.append(JSON.stringify(e));
        }
        buf.append("]");
        return buf.toString();
      };
      return "RenderState {\"" + "  text: " + this.text + "\n" + "  errors: " + listToString(this.errors) + "\n" + "  _errorsDisabled: " + this._errorsDisabled + "\n" + "  localContext: " + listToString(this.localContexts) + "\n" + "  globalContext: " + listToString(this.globalContexts) + "}";
    };

    return RenderState;

  })();

  Identifier = (function() {

    function Identifier(name, line) {
      var thisDot;
      this._isThis = name === '@';
      if (this._isThis) {
        this._startsWithThis = false;
        this._path = [];
        return;
      }
      thisDot = '@.';
      this._startsWithThis = startsWith(name, thisDot);
      if (this._startsWithThis) name = name.slice(thisDot.length);
      if (!/^[a-zA-Z0-9._\-\/]*$/.test(name)) {
        throw new ParseException(name + " is not a valid identifier", line);
      }
      this._path = name.split(".");
    }

    Identifier.prototype.resolve = function(renderState) {
      var resolved;
      if (this._isThis) return renderState.getFirstContext();
      if (this._startsWithThis) {
        return this._resolveFromContext(renderState.getFirstContext());
      }
      resolved = this._resolveFromContexts(renderState.localContexts);
      if (!(resolved != null)) {
        resolved = this._resolveFromContexts(renderState.globalContexts);
      }
      if (!(resolved != null)) {
        renderState.addError("Couldn't resolve identifier ", this._path);
      }
      return resolved;
    };

    Identifier.prototype._resolveFromContexts = function(contexts) {
      var context, resolved, _i, _len;
      for (_i = 0, _len = contexts.length; _i < _len; _i++) {
        context = contexts[_i];
        resolved = this._resolveFromContext(context);
        if (resolved != null) return resolved;
      }
      return null;
    };

    Identifier.prototype._resolveFromContext = function(context) {
      var next, result, _i, _len, _ref;
      result = context;
      _ref = this._path;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        next = _ref[_i];
        if (!(result != null) || typeof result !== 'object') return null;
        result = result[next];
      }
      return result;
    };

    Identifier.prototype.toString = function() {
      var name;
      if (this._isThis) return '@';
      name = this._path.join('.');
      if (this._startsWithThis) {
        return '@.' + name;
      } else {
        return name;
      }
    };

    return Identifier;

  })();

  Line = (function() {

    function Line(number) {
      this.number = number;
    }

    return Line;

  })();

  LeafNode = (function() {

    function LeafNode(line) {
      this._line = line;
    }

    LeafNode.prototype.startsWithNewLine = function() {
      return false;
    };

    LeafNode.prototype.trimStartingNewLine = function() {};

    LeafNode.prototype.trimEndingSpaces = function() {
      return 0;
    };

    LeafNode.prototype.trimEndingNewLine = function() {};

    LeafNode.prototype.endsWithEmptyLine = function() {
      return false;
    };

    LeafNode.prototype.getStartLine = function() {
      return this._line;
    };

    LeafNode.prototype.getEndLine = function() {
      return this._line;
    };

    return LeafNode;

  })();

  DecoratorNode = (function() {

    function DecoratorNode(content) {
      this._content = content;
    }

    DecoratorNode.prototype.startsWithNewLine = function() {
      return this._content.startsWithNewLine();
    };

    DecoratorNode.prototype.trimStartingNewLine = function() {
      return this._content.trimStartingNewLine();
    };

    DecoratorNode.prototype.trimEndingSpaces = function() {
      return this._content.trimEndingSpaces();
    };

    DecoratorNode.prototype.trimEndingNewLine = function() {
      return this._content.trimEndingNewLine();
    };

    DecoratorNode.prototype.endsWithEmptyLine = function() {
      return this._content.endsWithEmptyLine();
    };

    DecoratorNode.prototype.getStartLine = function() {
      return this._content.getStartLine();
    };

    DecoratorNode.prototype.getEndLine = function() {
      return this._content.getEndLine();
    };

    return DecoratorNode;

  })();

  InlineNode = (function() {

    __extends(InlineNode, DecoratorNode);

    function InlineNode() {
      InlineNode.__super__.constructor.apply(this, arguments);
    }

    InlineNode.prototype.contructor = function(content) {
      return InlineNode.__super__.contructor.call(this, content);
    };

    InlineNode.prototype.render = function(renderState) {
      var c, contentRenderState, _i, _len, _ref, _results;
      contentRenderState = renderState.inSameContext();
      this._content.render(contentRenderState);
      extend(renderState.errors, contentRenderState.errors);
      _ref = contentRenderState.text.toString();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (c !== '\n') {
          _results.push(renderState.text.append(c));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    InlineNode.prototype.toString = function() {
      return "INLINE(" + this._content + ")";
    };

    return InlineNode;

  })();

  IndentedNode = (function() {

    __extends(IndentedNode, DecoratorNode);

    function IndentedNode(content, indentation) {
      IndentedNode.__super__.constructor.call(this, content);
      this._indentation = indentation;
    }

    IndentedNode.prototype.render = function(renderState) {
      var c, contentRenderState, i, _len, _ref;
      contentRenderState = renderState.inSameContext();
      this._content.render(contentRenderState);
      extend(renderState.errors, contentRenderState.errors);
      this._indent(renderState.text);
      _ref = contentRenderState.text.toString();
      for (i = 0, _len = _ref.length; i < _len; i++) {
        c = _ref[i];
        renderState.text.append(c);
        if (c === '\n' && i < contentRenderState.text.length - 1) {
          this._indent(renderState.text);
        }
      }
      return renderState.text.append('\n');
    };

    IndentedNode.prototype._indent = function(buf) {
      var iterations, _results;
      iterations = this._indentation;
      _results = [];
      while (iterations-- > 0) {
        _results.push(buf.append(' '));
      }
      return _results;
    };

    IndentedNode.prototype.toString = function() {
      return "INDENTED(" + this._indentation + "," + this._content + ")";
    };

    return IndentedNode;

  })();

  BlockNode = (function() {

    __extends(BlockNode, DecoratorNode);

    function BlockNode(content) {
      BlockNode.__super__.constructor.call(this, content);
      content.trimStartingNewLine();
      content.trimEndingSpaces();
    }

    BlockNode.prototype.render = function(renderState) {
      return this._content.render(renderState);
    };

    BlockNode.prototype.toString = function() {
      return "BLOCK(" + this._content + ")";
    };

    return BlockNode;

  })();

  NodeCollection = (function() {

    function NodeCollection(nodes) {
      if (nodes.length === 0) throw new Error();
      this._nodes = nodes;
    }

    NodeCollection.prototype.render = function(renderState) {
      var node, _i, _len, _ref, _results;
      _ref = this._nodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(node.render(renderState));
      }
      return _results;
    };

    NodeCollection.prototype.startsWithNewLine = function() {
      return this._nodes[0].startsWithNewLine();
    };

    NodeCollection.prototype.trimStartingNewLine = function() {
      return this._nodes[0].trimStartingNewLine();
    };

    NodeCollection.prototype.trimEndingSpaces = function() {
      return this._nodes[this._nodes.length - 1].trimEndingSpaces();
    };

    NodeCollection.prototype.trimEndingNewLine = function() {
      return this._nodes[this._nodes.length - 1].trimEndingNewLine();
    };

    NodeCollection.prototype.endsWithNewLine = function() {
      return this._nodes[this._nodes.length - 1].endsWithEmptyLine();
    };

    NodeCollection.prototype.getStartLine = function() {
      return this._nodes[0].getStartLine();
    };

    NodeCollection.prototype.getEndLine = function() {
      return this._nodes[this._nodes.length - 1].getEndLine();
    };

    NodeCollection.prototype.toString = function() {
      var buf, node, _i, _len, _ref;
      buf = new StringBuilder();
      _ref = this._nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        buf.append(node);
      }
      return buf.toString();
    };

    return NodeCollection;

  })();

  StringNode = (function() {

    function StringNode(string, startLine, endLine) {
      this._string = string;
      this._startLine = startLine;
      this._endLine = endLine;
    }

    StringNode.prototype.render = function(renderState) {
      return renderState.text.append(this._string);
    };

    StringNode.prototype.startsWithNewLine = function() {
      return startsWith(this._string, '\n');
    };

    StringNode.prototype.trimStartingNewLine = function() {
      if (this.startsWithNewLine()) return this._string = this._string.slice(1);
    };

    StringNode.prototype.trimEndingSpaces = function() {
      var originalLength;
      originalLength = this._string.length;
      this._string = this._string.slice(0, this._lastIndexOfSpaces());
      return originalLength - this._string.length;
    };

    StringNode.prototype.trimEndingNewLine = function() {
      if (endsWith(this._string, '\n')) {
        return this._string = this._string.slice(0, this._string.length - 1);
      }
    };

    StringNode.prototype.endsWithEmptyLine = function() {
      var index;
      index = this._lastIndexOfSpaces();
      return index === 0 || this._string[index - 1] === '\n';
    };

    StringNode.prototype._lastIndexOfSpaces = function() {
      var index;
      index = this._string.length;
      while (index > 0 && this._string[index - 1] === ' ') {
        index--;
      }
      return index;
    };

    StringNode.prototype.getStartLine = function() {
      return this._startLine;
    };

    StringNode.prototype.getEndLine = function() {
      return this._endLine;
    };

    StringNode.prototype.toString = function() {
      return "STRING(" + this._string + ")";
    };

    return StringNode;

  })();

  EscapedVariableNode = (function() {

    __extends(EscapedVariableNode, LeafNode);

    function EscapedVariableNode(id, line) {
      EscapedVariableNode.__super__.constructor.call(this, line);
      this._id = id;
    }

    EscapedVariableNode.prototype.render = function(renderState) {
      var value;
      value = this._id.resolve(renderState);
      if (value != null) {
        return this._appendEscapedHtml(renderState.text, value.toString());
      }
    };

    EscapedVariableNode.prototype._appendEscapedHtml = function(escaped, unescaped) {
      var c, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = unescaped.length; _i < _len; _i++) {
        c = unescaped[_i];
        switch (c) {
          case '<':
            _results.push(escaped.append("&lt;"));
            break;
          case '>':
            _results.push(escaped.append("&gt;"));
            break;
          case '&':
            _results.push(escaped.append("&amp;"));
            break;
          default:
            _results.push(escaped.append(c));
        }
      }
      return _results;
    };

    EscapedVariableNode.prototype.toString = function() {
      return "{{" + this._id + "}}";
    };

    return EscapedVariableNode;

  })();

  UnescapedVariableNode = (function() {

    __extends(UnescapedVariableNode, LeafNode);

    function UnescapedVariableNode(id, line) {
      UnescapedVariableNode.__super__.constructor.call(this, line);
      this._id = id;
    }

    UnescapedVariableNode.prototype.render = function(renderState) {
      var value;
      value = this._id.resolve(renderState);
      if (value != null) return renderState.text.append(value);
    };

    UnescapedVariableNode.prototype.toString = function() {
      return "{{{" + this._id + "}}}";
    };

    return UnescapedVariableNode;

  })();

  SectionNode = (function() {

    __extends(SectionNode, DecoratorNode);

    function SectionNode(id, content) {
      SectionNode.__super__.constructor.call(this, content);
      this._id = id;
    }

    SectionNode.prototype.render = function(renderState) {
      var item, value, _i, _len, _results;
      value = this._id.resolve(renderState);
      if (!(value != null)) return;
      if (value instanceof Array) {
        _results = [];
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          item = value[_i];
          renderState.localContexts.unshift(item);
          this._content.render(renderState);
          _results.push(renderState.localContexts.shift());
        }
        return _results;
      } else if (typeof value === 'object') {
        renderState.localContexts.unshift(value);
        this._content.render(renderState);
        return renderState.localContexts.shift();
      } else {
        return renderState.addError("{{#", this._id, "}} cannot be rendered with that type");
      }
    };

    SectionNode.prototype.toString = function() {
      return "{{#" + this._id + "}}" + this._content + "{{/" + this._id + "}}";
    };

    return SectionNode;

  })();

  VertedSectionNode = (function() {

    __extends(VertedSectionNode, DecoratorNode);

    function VertedSectionNode(id, content) {
      VertedSectionNode.__super__.constructor.call(this, content);
      this._id = id;
    }

    VertedSectionNode.prototype.render = function(renderState) {
      var value;
      value = this._id.resolve(renderState.inSameContext().disableErrors());
      if (VertedSectionNode.shouldRender(value)) {
        renderState.localContexts.unshift(value);
        this._content.render(renderState);
        return renderState.localContexts.shift();
      }
    };

    VertedSectionNode.prototype.toString = function() {
      return "{{?" + this._id + "}}" + this._content + "{{/" + this._id + "}}";
    };

    return VertedSectionNode;

  })();

  VertedSectionNode.shouldRender = function(value) {
    var type;
    if (!(value != null)) return false;
    type = typeof value;
    if (type === 'boolean') return value;
    if (type === 'number') return true;
    if (type === 'string') return true;
    if (value instanceof Array) return value.length > 0;
    if (type === 'object') return true;
    throw new Error("Unhandled type: " + type);
  };

  InvertedSectionNode = (function() {

    __extends(InvertedSectionNode, DecoratorNode);

    function InvertedSectionNode(id, content) {
      InvertedSectionNode.__super__.constructor.call(this, content);
      this._id = id;
    }

    InvertedSectionNode.prototype.render = function(renderState) {
      var value;
      value = this._id.resolve(renderState.inSameContext().disableErrors());
      if (!VertedSectionNode.shouldRender(value)) {
        return this._content.render(renderState);
      }
    };

    InvertedSectionNode.prototype.toString = function() {
      return "{{^" + this._id + "}}" + this._content + "{{/" + this._id + "}}";
    };

    return InvertedSectionNode;

  })();

  JsonNode = (function() {

    __extends(JsonNode, LeafNode);

    function JsonNode(id, line) {
      JsonNode.__super__.constructor.call(this, line);
      this._id = id;
    }

    JsonNode.prototype.render = function(renderState) {
      var value;
      value = this._id.resolve(renderState);
      if (value != null) return renderState.text.append(JSON.stringify(value));
    };

    JsonNode.prototype.toString = function() {
      return "{{*" + this._id + "}}";
    };

    return JsonNode;

  })();

  PartialNode = (function() {

    __extends(PartialNode, LeafNode);

    function PartialNode(id, line) {
      PartialNode.__super__.constructor.call(this, line);
      this._id = id;
      this._args = null;
    }

    PartialNode.prototype.render = function(renderState) {
      var argContext, argContextMap, context, key, partialRenderState, text, value, valueId, _ref;
      value = this._id.resolve(renderState);
      if (!(value instanceof Handlebar)) {
        renderState.addError(this._id, " didn't resolve to a Handlebar");
        return;
      }
      argContext = [];
      if (renderState.localContexts.length > 0) {
        argContext.push(renderState.localContexts[0]);
      }
      if (this._args != null) {
        argContextMap = {};
        _ref = this._args;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          valueId = _ref[key];
          context = valueId.resolve(renderState);
          if (context != null) argContextMap[key] = context;
        }
        argContext.push(argContextMap);
      }
      partialRenderState = new RenderState(renderState.globalContexts, argContext);
      value._topNode.render(partialRenderState);
      text = partialRenderState.text.toString();
      if (text.length > 0 && text[text.length - 1] === '\n') {
        text = text.slice(0, text.length - 1);
      }
      renderState.text.append(text);
      return extend(renderState.errors, partialRenderState.errors);
    };

    PartialNode.prototype.addArgument = function(key, valueId) {
      if (!(this._args != null)) this._args = {};
      return this._args[key] = valueId;
    };

    PartialNode.prototype.toString = function() {
      return "{{+" + this._id + "}}";
    };

    return PartialNode;

  })();

  Token = (function() {

    function Token(name, text, clazz) {
      this.name = name;
      this.text = text;
      this.clazz = clazz;
    }

    Token.prototype.elseNodeClass = function() {
      if (this.clazz === VertedSectionNode) return InvertedSectionNode;
      if (this.clazz === InvertedSectionNode) return VertedSectionNode;
      throw new Error(this.name + " can not have an else clause.");
    };

    return Token;

  })();

  Token.values = [new Token("OPEN_START_SECTION", "{{#", SectionNode), new Token("OPEN_START_VERTED_SECTION", "{{?", VertedSectionNode), new Token("OPEN_START_INVERTED_SECTION", "{{^", InvertedSectionNode), new Token("OPEN_START_JSON", "{{*", JsonNode), new Token("OPEN_START_PARTIAL", "{{+", PartialNode), new Token("OPEN_ELSE", "{{:", null), new Token("OPEN_END_SECTION", "{{/", null), new Token("OPEN_UNESCAPED_VARIABLE", "{{{", UnescapedVariableNode), new Token("CLOSE_MUSTACHE3", "}}}", null), new Token("OPEN_COMMENT", "{{-", null), new Token("CLOSE_COMMENT", "-}}", null), new Token("OPEN_VARIABLE", "{{", EscapedVariableNode), new Token("CLOSE_MUSTACHE", "}}", null), new Token("CHARACTER", ".", StringNode)];

  (function() {
    var token, _i, _len, _ref, _results;
    _ref = Token.values;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      token = _ref[_i];
      _results.push(Token[token.name] = token);
    }
    return _results;
  })();

  TokenStream = (function() {

    function TokenStream(string) {
      this._remainder = string;
      this.nextToken = null;
      this.nextContents = null;
      this.nextLine = new Line(1);
      this.advance();
    }

    TokenStream.prototype.hasNext = function() {
      return this.nextToken != null;
    };

    TokenStream.prototype.advance = function() {
      var token, _i, _len, _ref;
      if (this.nextContents === '\n') {
        this.nextLine = new Line(this.nextLine.number + 1);
      }
      this.nextToken = null;
      this.nextContents = null;
      if (this._remainder.length === 0) return null;
      _ref = Token.values;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        token = _ref[_i];
        if (this._remainder.slice(0, token.text.length) === token.text) {
          this.nextToken = token;
          break;
        }
      }
      if (this.nextToken === null) this.nextToken = Token.CHARACTER;
      this.nextContents = this._remainder.slice(0, this.nextToken.text.length);
      this._remainder = this._remainder.slice(this.nextToken.text.length);
      return this;
    };

    TokenStream.prototype.advanceOver = function(token, excluded) {
      if (this.nextToken !== token) {
        throw new ParseException("Expecting token " + token.name + " but got " + this.nextToken.name, this.nextLine);
      }
      return this.advance();
    };

    TokenStream.prototype.advanceOverNextString = function(excluded) {
      var buf;
      buf = new StringBuilder();
      while (this.nextToken === Token.CHARACTER && (!(excluded != null) || excluded.indexOf(this.nextContents) === -1)) {
        buf.append(this.nextContents);
        this.advance();
      }
      return buf.toString();
    };

    return TokenStream;

  })();

  Handlebar = (function() {

    function Handlebar(template) {
      var tokens;
      this.source = template;
      tokens = new TokenStream(template);
      this._topNode = this._parseSection(tokens);
      if (!(this._topNode != null)) {
        throw new ParseException("Template is empty", tokens.nextLine);
      }
      if (tokens.hasNext()) {
        throw new ParseSection("There are still tokens remaining, was there an ", "end-section without a start-section?", tokens.nextLine);
      }
    }

    Handlebar.prototype._parseSection = function(tokens) {
      var elseSection, i, id, indentation, key, nextNode, node, nodes, partialNode, previousNode, renderedNode, section, sectionEnded, startLine, string, token, _len;
      nodes = [];
      sectionEnded = false;
      while (tokens.hasNext() && !sectionEnded) {
        token = tokens.nextToken;
        switch (token) {
          case Token.CHARACTER:
            startLine = tokens.nextLine;
            string = tokens.advanceOverNextString();
            nodes.push(new StringNode(string, startLine, tokens.nextLine));
            break;
          case Token.OPEN_VARIABLE:
          case Token.OPEN_UNESCAPED_VARIABLE:
          case Token.OPEN_START_JSON:
            id = this._openSectionOrTag(tokens);
            nodes.push(new token.clazz(id, tokens.nextLine));
            break;
          case Token.OPEN_START_PARTIAL:
            tokens.advance();
            id = new Identifier(tokens.advanceOverNextString(' '), tokens.nextLine);
            partialNode = new PartialNode(id, tokens.nextLine);
            while (tokens.nextToken === Token.CHARACTER) {
              tokens.advance();
              key = tokens.advanceOverNextString(':');
              tokens.advance();
              partialNode.addArgument(key, new Identifier(tokens.advanceOverNextString(' '), tokens.nextLine));
            }
            tokens.advanceOver(Token.CLOSE_MUSTACHE);
            nodes.push(partialNode);
            break;
          case Token.OPEN_START_SECTION:
            id = this._openSectionOrTag(tokens);
            section = this._parseSection(tokens);
            this._closeSection(tokens, id);
            if (section != null) nodes.push(new SectionNode(id, section));
            break;
          case Token.OPEN_START_VERTED_SECTION:
          case Token.OPEN_START_INVERTED_SECTION:
            id = this._openSectionOrTag(tokens);
            section = this._parseSection(tokens);
            elseSection = null;
            if (tokens.nextToken === Token.OPEN_ELSE) {
              this._openElse(tokens, id);
              elseSection = this._parseSection(tokens);
            }
            this._closeSection(tokens, id);
            if (section != null) nodes.push(new token.clazz(id, section));
            if (elseSection != null) {
              nodes.push(new (token.elseNodeClass())(id, elseSection));
            }
            break;
          case Token.OPEN_COMMENT:
            this._advanceOverComment(tokens);
            break;
          case Token.OPEN_END_SECTION:
          case Token.OPEN_ELSE:
            sectionEnded = true;
            break;
          case Token.CLOSE_MUSTACHE:
            throw new ParseException("Orphaned " + tokens.nextToken, tokens.nextLine);
        }
      }
      for (i = 0, _len = nodes.length; i < _len; i++) {
        node = nodes[i];
        if (node instanceof StringNode) continue;
        previousNode = i > 0 ? nodes[i - 1] : null;
        nextNode = i < nodes.length - 1 ? nodes[i + 1] : null;
        renderedNode = null;
        if (node.getStartLine() !== node.getEndLine()) {
          renderedNode = new BlockNode(node);
          if (previousNode != null) previousNode.trimEndingSpaces();
          if (nextNode != null) nextNode.trimStartingNewLine();
        } else if ((node instanceof LeafNode) && (!(previousNode != null) || previousNode.endsWithEmptyLine()) && (!(nextNode != null) || nextNode.startsWithNewLine())) {
          indentation = 0;
          if (previousNode != null) indentation = previousNode.trimEndingSpaces();
          if (nextNode != null) nextNode.trimStartingNewLine();
          renderedNode = new IndentedNode(node, indentation);
        } else {
          renderedNode = new InlineNode(node);
        }
        nodes[i] = renderedNode;
      }
      if (nodes.length === 0) {
        return null;
      } else if (nodes.length === 1) {
        return nodes[0];
      }
      return new NodeCollection(nodes);
    };

    Handlebar.prototype._advanceOverComment = function(tokens) {
      var depth, _results;
      tokens.advanceOver(Token.OPEN_COMMENT);
      depth = 1;
      _results = [];
      while (tokens.hasNext() && depth > 0) {
        if (tokens.nextToken === Token.OPEN_COMMENT) {
          depth++;
        } else if (tokens.nextToken === Token.CLOSE_COMMENT) {
          depth--;
        }
        _results.push(tokens.advance());
      }
      return _results;
    };

    Handlebar.prototype._openSectionOrTag = function(tokens) {
      var id, openToken;
      openToken = tokens.nextToken;
      tokens.advance();
      id = new Identifier(tokens.advanceOverNextString(), tokens.nextLine);
      if (openToken === Token.OPEN_UNESCAPED_VARIABLE) {
        tokens.advanceOver(Token.CLOSE_MUSTACHE3);
      } else {
        tokens.advanceOver(Token.CLOSE_MUSTACHE);
      }
      return id;
    };

    Handlebar.prototype._closeSection = function(tokens, id) {
      var nextString;
      tokens.advanceOver(Token.OPEN_END_SECTION);
      nextString = tokens.advanceOverNextString();
      if (nextString.length > 0 && id.toString() !== nextString) {
        throw new ParseException("Start section " + id + " doesn't match end " + nextString, tokens.nextLine);
      }
      return tokens.advanceOver(Token.CLOSE_MUSTACHE);
    };

    Handlebar.prototype._openElse = function(tokens, id) {
      var nextString;
      tokens.advanceOver(Token.OPEN_ELSE);
      nextString = tokens.advanceOverNextString();
      if (nextString.length > 0 && id.toString() !== nextString) {
        throw new ParseException("Start section " + id + " doesn't match else " + nextString, tokens.nextLine);
      }
      return tokens.advanceOver(Token.CLOSE_MUSTACHE);
    };

    Handlebar.prototype.render = function() {
      var context, contexts, globalContexts, renderState, _i, _len;
      contexts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      globalContexts = [];
      for (_i = 0, _len = contexts.length; _i < _len; _i++) {
        context = contexts[_i];
        globalContexts.push(context);
      }
      renderState = new RenderState(globalContexts, []);
      this._topNode.render(renderState);
      return renderState.getResult();
    };

    return Handlebar;

  })();

  Handlebar.RenderResult = RenderResult;

  window.Handlebar = Handlebar;

}).call(this);
