/**
 * Decap CMS Custom Initialization
 * - Aplica estilo customizado no preview do cardápio
 * - Registra Preview Template reativo para o cardápio
 */

(function () {
  if (typeof CMS === 'undefined') return;

  // Injetar CSS do cardápio no iframe de preview
  CMS.registerPreviewStyle('/styles/preview.css');

  var h = window.h;
  var createClass = window.createClass;

  if (!createClass && window.React && window.React.Component) {
    createClass = function (spec) {
      function Comp(props) {
        window.React.Component.call(this, props);
      }
      Comp.prototype = Object.create(window.React.Component.prototype);
      Comp.prototype.constructor = Comp;
      Object.assign(Comp.prototype, spec);
      return Comp;
    };
  }

  // Preview para Itens do Cardápio
  var CardapioPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      if (!entry) return null;

      var getAsset = this.props.getAsset || function (x) { return x; };
      var data = entry.get ? entry.get('data') : entry.data;
      if (!data) return null;

      function getVal(key, fallback) {
        if (!data) return fallback;
        if (typeof data.get === 'function') {
          var v = data.get(key);
          return v !== undefined && v !== null ? v : fallback;
        }
        return data[key] !== undefined && data[key] !== null ? data[key] : fallback;
      }

      var nome = getVal('nome', 'Nome do Prato');
      var descricao = getVal('descricao', '');
      var preco = getVal('preco', null);
      var foto = getVal('foto', null);
      var categoria = getVal('categoria', 'Geral');
      var destaque = getVal('destaque', false) === true;
      var disponivel = getVal('disponivel', true) !== false;
      var ingredientes = getVal('ingredientes', null);
      var tags = getVal('tags', null);

      var imgSrc = null;
      if (foto) {
        try {
          var asset = getAsset(foto);
          imgSrc = asset ? asset.toString() : null;
        } catch (e) {
          imgSrc = foto;
        }
      }

      var precoFmt = preco !== null && preco !== '' && !isNaN(Number(preco))
        ? 'R$ ' + Number(preco).toFixed(2).replace('.', ',')
        : 'R$ 0,00';

      var tagsArray = [];
      if (tags) {
        if (typeof tags.toJS === 'function') {
          tagsArray = tags.toJS();
        } else if (Array.isArray(tags)) {
          tagsArray = tags;
        }
      }

      var ingredientesArray = [];
      if (ingredientes) {
        if (typeof ingredientes.toJS === 'function') {
          ingredientesArray = ingredientes.toJS();
        } else if (Array.isArray(ingredientes)) {
          ingredientesArray = ingredientes;
        }
      }

      return h('div', { className: 'preview-container' },
        // Header de status do preview
        h('div', { className: 'preview-header' },
          h('span', { className: 'preview-badge' }, 'Visualização em Tempo Real'),
          h('span', { className: 'preview-category' }, 'Categoria: ' + categoria)
        ),

        // Card do cardápio fiel ao MenuCard.astro
        h('article', { className: 'menu-card' + (!disponivel ? ' menu-card--soldout' : '') },
          // Mídia / Foto
          h('div', { className: 'card-media' },
            imgSrc
              ? h('img', { src: imgSrc, alt: nome, className: 'card-img' })
              : h('span', { className: 'card-placeholder' }, '🍽️'),
            destaque ? h('span', { className: 'card-star-badge', title: 'Destaque do Chef' }, '⭐') : null
          ),

          // Conteúdo do Card
          h('div', { className: 'card-content' },
            h('div', { className: 'card-header' },
              h('h4', { className: 'card-title' }, nome),
              h('span', { className: 'card-price' }, precoFmt)
            ),

            descricao ? h('p', { className: 'card-desc' }, descricao) : null,

            // Ingredientes
            ingredientesArray && ingredientesArray.length > 0
              ? h('details', { className: 'card-details' },
                  h('summary', null, 'Ver ingredientes'),
                  h('p', null, ingredientesArray.join(', '))
                )
              : null,

            // Tags
            tagsArray && tagsArray.length > 0
              ? h('div', { className: 'card-tags' },
                  tagsArray.map(function (tag, idx) {
                    return h('span', { key: idx, className: 'tag-pill' }, tag);
                  })
                )
              : null,

            // Ações / Botão Adicionar ou Esgotado
            h('div', { className: 'card-actions' },
              !disponivel
                ? h('span', { className: 'soldout-label' }, 'Esgotado por hoje')
                : h('button', { type: 'button', className: 'add-to-cart-btn' },
                    h('span', null, '+ Adicionar à Sacola')
                  )
            )
          )
        )
      );
    }
  });

  CMS.registerPreviewTemplate('cardapio', CardapioPreview);
})();
