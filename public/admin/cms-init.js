/**
 * Decap CMS Custom Initialization
 * - Aplica estilo customizado no preview do cardápio
 * - Registra Preview Template reativo para o cardápio
 */

function initCmsPreview() {
  if (typeof CMS === 'undefined') return false;

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
  console.log('[cms-init] CardapioPreview registered');

  // Preview para Configurações do Estabelecimento
  var SettingsPreview = createClass({
    render: function () {
      var entry = this.props.entry;
      if (!entry) return null;

      var data = entry.get ? entry.get('data') : entry.data;
      if (!data) return null;

      function getVal(obj, path, fallback) {
        if (!obj) return fallback;
        var parts = path.split('.');
        var current = obj;
        for (var i = 0; i < parts.length; i++) {
          if (current && typeof current.get === 'function') {
            current = current.get(parts[i]);
          } else if (current && current[parts[i]] !== undefined) {
            current = current[parts[i]];
          } else {
            return fallback;
          }
          if (current === undefined || current === null) return fallback;
        }
        return current;
      }

      var nome = getVal(data, 'negocio.nome', 'Estabelecimento');
      var ramo = getVal(data, 'negocio.ramo', '');
      var slogan = getVal(data, 'negocio.slogan', '');
      var descricao = getVal(data, 'negocio.descricao', '');
      var selo_hero = getVal(data, 'negocio.selo_hero', '');
      var nota = getVal(data, 'negocio.nota', '');
      var totalPedidos = getVal(data, 'negocio.total_pedidos_mes', '');
      var instagram = getVal(data, 'negocio.instagram', '');
      var instagramUser = getVal(data, 'negocio.instagram_user', '');
      var horario = getVal(data, 'atendimento.horario', '');
      var endereco = getVal(data, 'atendimento.endereco', '');
      var whatsapp = getVal(data, 'atendimento.whatsapp', '');
      var pagamentos = getVal(data, 'atendimento.pagamentos', '');
      var tempoEntrega = getVal(data, 'atendimento.tempo_entrega', '');

      // Cores reais do site (settings.json / global.css)
      var C = {
        bg: '#19120e',
        surface: '#261e1a',
        surfaceCard: '#211a16',
        primary: '#f66018',
        secondary: '#ee9800',
        text: '#eee0d8',
        muted: '#e2bfb2',
        whatsapp: '#00a74c',
        radius: '16px',
      };

      return h('div', { style: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", maxWidth: '480px', margin: '0 auto', padding: '16px', background: C.bg, color: C.text, borderRadius: C.radius } },
        // Hero Card (espelha Hero.astro)
        h('div', { style: { background: C.surface, border: '1px solid rgba(255,255,255,0.08)', borderRadius: C.radius, overflow: 'hidden', marginBottom: '16px' } },
          // Header com selo + ramo
          h('div', { style: { padding: '16px 16px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' } },
            h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', background: 'rgba(238,152,0,0.15)', color: C.secondary, border: '1px solid rgba(238,152,0,0.3)' } }, '\u2728 ' + (selo_hero || 'Destaque')),
            h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', background: 'rgba(246,96,24,0.15)', color: C.primary, border: '1px solid rgba(246,96,24,0.3)' } }, '\uD83D\uDD25 ' + ramo)
          ),
          // Slogan
          h('div', { style: { padding: '0 16px 12px' } },
            h('h2', { style: { fontSize: '18px', fontWeight: 800, lineHeight: 1.25, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' } }, slogan),
            h('p', { style: { fontSize: '13px', color: C.muted, lineHeight: 1.5, margin: 0 } }, descricao)
          ),
          // Social Proof (espelha Hero social-proof)
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', margin: '0 16px 16px', padding: '10px 14px', background: 'rgba(0,0,0,0.35)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px' } },
            h('span', { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
              h('span', null, '\u2B50'),
              h('strong', { style: { color: C.secondary } }, String(nota))
            ),
            h('div', { style: { width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)' } }),
            h('span', { style: { display: 'flex', alignItems: 'center', gap: '4px', color: C.text, fontWeight: 600 } },
              h('span', null, '\uD83D\uDEF5'),
              h('span', null, totalPedidos)
            ),
            tempoEntrega ? h('div', { style: { width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)' } }) : null,
            tempoEntrega ? h('span', { style: { display: 'flex', alignItems: 'center', gap: '4px', color: C.text, fontWeight: 600 } },
              h('span', null, '\uD83D\uDCE6'),
              h('span', null, tempoEntrega)
            ) : null
          )
        ),

        // Footer Info Card (espelha Footer.astro)
        h('div', { style: { background: C.surface, border: '1px solid rgba(255,255,255,0.06)', borderRadius: C.radius, padding: '14px', display: 'grid', gap: '14px' } },
          // Endereço
          endereco ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: C.text } },
              h('span', null, '\uD83D\uDCCD'),
              h('strong', null, 'Endereço & Retirada')
            ),
            h('p', { style: { fontSize: '12px', color: C.muted, lineHeight: 1.4, paddingLeft: '22px', margin: 0 } }, endereco)
          ) : null,
          // Horário
          horario ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: C.text } },
              h('span', null, '\uD83D\uDD52'),
              h('strong', null, 'Horário de Funcionamento')
            ),
            h('p', { style: { fontSize: '12px', color: C.muted, lineHeight: 1.4, paddingLeft: '22px', margin: 0 } }, horario)
          ) : null,
          // Pagamentos
          pagamentos ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: C.text } },
              h('span', null, '\uD83D\uDCB3'),
              h('strong', null, 'Formas de Pagamento')
            ),
            h('p', { style: { fontSize: '12px', color: C.muted, lineHeight: 1.4, paddingLeft: '22px', margin: 0 } }, pagamentos)
          ) : null,
          // Instagram
          instagram ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: C.text } },
              h('span', null, '\uD83D\uDCF2'),
              h('strong', null, 'Redes Sociais')
            ),
            h('p', { style: { fontSize: '12px', paddingLeft: '22px', margin: 0 } },
              h('a', { href: instagram, target: '_blank', style: { color: C.primary, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' } }, instagramUser + ' no Instagram')
            )
          ) : null
        ),

        // Copyright
        h('p', { style: { textAlign: 'center', marginTop: '16px', fontSize: '11px', color: C.muted, opacity: 0.7 } }, '\u00A9 ' + new Date().getFullYear() + ' ' + nome + '. Todos os direitos reservados.')
      );
    }
  });

  // Para file collections, o name deve ser o "name" do arquivo, não da coleção
  CMS.registerPreviewTemplate('settings', SettingsPreview);
  console.log('[cms-init] Preview templates registered');
  return true;
}

// Aguarda CMS global ficar disponível (pode demorar por ser bundle via CDN)
function waitForCms() {
  if (initCmsPreview()) return;
  var attempts = 0;
  var interval = setInterval(function () {
    attempts++;
    if (initCmsPreview() || attempts > 30) {
      clearInterval(interval);
    }
  }, 200);
}

if (document.readyState === 'complete') {
  waitForCms();
} else {
  window.addEventListener('load', waitForCms);
}
