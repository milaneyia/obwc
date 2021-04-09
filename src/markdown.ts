import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

// Remember old renderer, if overridden, or proxy to default renderer
let defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const aIndex = tokens[idx].attrIndex('target');

    if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']);
    } else {
        const tokenAttrs = tokens[idx].attrs;
        if (tokenAttrs)
            tokenAttrs[aIndex][1] = '_blank';
    }

    return defaultRender(tokens, idx, options, env, self);
};

defaultRender = md.renderer.rules.table_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.table_open = function(tokens, idx, options, env, self) {
    tokens[idx].attrPush(['class', 'table table-dark w-auto mx-auto table-hover']);

    return defaultRender(tokens, idx, options, env, self);
};

defaultRender = md.renderer.rules.heading_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
    tokens[idx].attrPush(['class', 'border-bottom mb-4']);

    return defaultRender(tokens, idx, options, env, self);
};

export default md;
