export default [
  {
    prefix: 'a',
    body: '<a href="$1">$2</a>$3',
    description: 'Tag: `<a href=""></a>`',
  },
  {
    prefix: 'abbr',
    body: '<abbr title="$1">$2</abbr>$3',
    description: 'Tag: `<abbr title=""></abbr>`',
  },
  {
    prefix: 'address',
    body: '<address>$1</address>',
    description: 'Tag: `<address></address>`',
  },
  {
    prefix: 'article',
    body: '<article>$1</article>',
    description: 'Tag: `<article></article>`',
  },
  {
    prefix: 'aside',
    body: '<aside>$1</aside>$2',
    description: 'Tag: `<aside></aside>`',
  },
  {
    prefix: 'b',
    body: '<b>$1</b>$2',
    description: 'Tag: `<b></b>`',
  },
  {
    prefix: 'blockquote',
    body: '<blockquote cite="$2">$1</blockquote>',
    description: 'Tag: `<blockquote cite=""></blockquote>`',
  },
  {
    prefix: 'br',
    body: '<br>',
    description: 'Tag: `<br>`',
  },
  {
    prefix: 'button',
    body: '<button type="$1">$2</button>$3',
    description: 'Tag: `<button type=""></button>`',
  },
  {
    prefix: 'caption',
    body: '<caption>$1</caption>$2',
    description: 'Tag: `<caption></caption>`',
  },
  {
    prefix: 'cite',
    body: '<cite>$1</cite>$2',
    description: 'Tag: `<cite></cite>`',
  },
  {
    prefix: 'code',
    body: '<code>$1</code>$2',
    description: 'Tag: `<code></code>`',
  },
  {
    prefix: 'col',
    body: '<col>$2',
    description: 'Tag: `<col>`',
  },
  {
    prefix: 'colgroup',
    body: '<colgroup>$1</colgroup>',
    description: 'Tag: `<colgroup></colgroup>`',
  },
  {
    prefix: 'datalist',
    body: '<datalist>$1</datalist>',
    description: 'Tag: `<datalist></datalist>`',
  },
  {
    prefix: 'dd',
    body: '<dd>$1</dd>$2',
    description: 'Tag: `<dd></dd>`',
  },
  {
    prefix: 'del',
    body: '<del>$1</del>$2',
    description: 'Tag: `<del></del>`',
  },
  {
    prefix: 'details',
    body: '<details>$1</details>',
    description: 'Tag: `<details></details>`',
  },
  {
    prefix: 'dialog',
    body: '<dialog>$1</dialog>$2',
    description: 'Tag: `<dialog></dialog>`',
  },
  {
    prefix: 'dfn',
    body: '<dfn>$1</dfn>$2',
    description: 'Tag: `<dfn></dfn>`',
  },
  {
    prefix: 'div',
    body: '<div>$1</div>',
    description: 'Tag: `<div></div>`',
  },
  {
    prefix: 'dl',
    body: '<dl>$1</dl>',
    description: 'Tag: `<dl></dl>`',
  },
  {
    prefix: 'dt',
    body: '<dt>$1</dt>$2',
    description: 'Tag: `<dt></dt>`',
  },
  {
    prefix: 'em',
    body: '<em>$1</em>$2',
    description: 'Tag: `<em></em>`',
  },
  {
    prefix: 'fieldset',
    body: '<fieldset>$1</fieldset>',
    description: 'Tag: `<fieldset></fieldset>`',
  },
  {
    prefix: 'figcaption',
    body: '<figcaption>$1</figcaption>$2',
    description: 'Tag: `<figcaption></figcaption>`',
  },
  {
    prefix: 'figure',
    body: '<figure>$1</figure>',
    description: 'Tag: `<figure></figure>`',
  },
  {
    prefix: 'footer',
    body: '<footer>$1</footer>',
    description: 'Tag: `<footer></footer>`',
  },
  {
    prefix: 'form',
    body: '<form>$1</form>',
    description: 'Tag: `<form></form>`',
  },
  {
    prefix: 'h1',
    body: '<h1>$1</h1>$2',
    description: 'Tag: `<h1></h1>`',
  },
  {
    prefix: 'h2',
    body: '<h2>$1</h2>$2',
    description: 'Tag: `<h2></h2>`',
  },
  {
    prefix: 'h3',
    body: '<h3>$1</h3>$2',
    description: 'Tag: `<h3></h3>`',
  },
  {
    prefix: 'h4',
    body: '<h4>$1</h4>$2',
    description: 'Tag: `<h4></h4>`',
  },
  {
    prefix: 'h5',
    body: '<h5>$1</h5>$2',
    description: 'Tag: `<h5></h5>`',
  },
  {
    prefix: 'h6',
    body: '<h6>$1</h6>$2',
    description: 'Tag: `<h6></h6>`',
  },
  {
    prefix: 'header',
    body: '<header>$1</header>',
    description: 'Tag: `<header></header>`',
  },
  {
    prefix: 'hr',
    body: '<hr>',
    description: 'Tag: `<hr>`',
  },
  {
    prefix: 'i',
    body: '<i>$1</i>$2',
    description: 'Tag: `<i></i>`',
  },
  {
    prefix: 'iframe',
    body: '<iframe src="$1">$2</iframe>$3',
    description: 'Tag: `<iframe src=""></iframe>`',
  },
  {
    prefix: 'img',
    body: '<img src="$1" alt="$2">$3',
    description: 'Tag: `<img src="" alt="">`',
  },
  {
    prefix: 'input',
    body: '<input type="$1" name="$2" value="$3">$4',
    description: 'Tag: `<input type="" name="" value="">`',
  },
  {
    prefix: 'label',
    body: '<label for="$1">$2</label>$3',
    description: 'Tag: `<label for=""></label>`',
  },
  {
    prefix: 'legend',
    body: '<legend>$1</legend>$2',
    description: 'Tag: `<legend></legend>`',
  },
  {
    prefix: 'li',
    body: '<li>$1</li>$2',
    description: 'Tag: `<li></li>`',
  },
  {
    prefix: 'main',
    body: '<main>$1</main>',
    description: 'Tag: `<main></main>`',
  },
  {
    prefix: 'map',
    body: '<map name="$1">$2</map>',
    description: 'Tag: `<map name=""></map>`',
  },
  {
    prefix: 'mark',
    body: '<mark>$1</mark>$2',
    description: 'Tag: `<mark></mark>`',
  },
  {
    prefix: 'menu',
    body: '<menu>$1</menu>',
    description: 'Tag: `<menu></menu>`',
  },
  {
    prefix: 'meter',
    body: '<meter value="$1">$2</meter>$3',
    description: 'Tag: `<meter value=""></meter>`',
  },
  {
    prefix: 'nav',
    body: '<nav>$1</nav>',
    description: 'Tag: `<nav></nav>`',
  },
  {
    prefix: 'object',
    body: '<object width="$1" height="$2" data="$3">$4</object>$5',
    description: 'Tag: `<object width="" height="" data=""></object>`',
  },
  {
    prefix: 'ol',
    body: '<ol>$1</ol>',
    description: 'Tag: `<ol></ol>`',
  },
  {
    prefix: 'optgroup',
    body: '<optgroup>$1</optgroup>',
    description: 'Tag: `<optgroup></optgroup>`',
  },
  {
    prefix: 'option',
    body: '<option value="$1">$2</option>$3',
    description: 'Tag: `<option value=""></option>`',
  },
  {
    prefix: 'p',
    body: '<p>$1</p>$2',
    description: 'Tag: `<p></p>`',
  },
  {
    prefix: 'pre',
    body: '<pre>$1</pre>',
    description: 'Tag: `<pre></pre>`',
  },
  {
    prefix: 'q',
    body: '<q>$1</q>$2',
    description: 'Tag: `<q></q>`',
  },
  {
    prefix: 's',
    body: '<s>$1</s>$2',
    description: 'Tag: `<s></s>`',
  },
  {
    prefix: 'section',
    body: '<section>$1</section>',
    description: 'Tag: `<section></section>`',
  },
  {
    prefix: 'select',
    body: '<select>$1</select>',
    description: 'Tag: `<select></select>`',
  },
  {
    prefix: 'small',
    body: '<small>$1</small>$2',
    description: 'Tag: `<small></small>`',
  },
  {
    prefix: 'span',
    body: '<span>$1</span>$2',
    description: 'Tag: `<span></span>`',
  },
  {
    prefix: 'strong',
    body: '<strong>$1</strong>$2',
    description: 'Tag: `<strong></strong>`',
  },
  {
    prefix: 'sub',
    body: '<sub>$1</sub>$2',
    description: 'Tag: `<sub></sub>`',
  },
  {
    prefix: 'sup',
    body: '<sup>$1</sup>$2',
    description: 'Tag: `<sup></sup>`',
  },
  {
    prefix: 'table',
    body: '<table>$1</table>',
    description: 'Tag: `<table></table>`',
  },
  {
    prefix: 'tbody',
    body: '<tbody>$1</tbody>',
    description: 'Tag: `<tbody></tbody>`',
  },
  {
    prefix: 'td',
    body: '<td>$1</td>$2',
    description: 'Tag: `<td></td>`',
  },
  {
    prefix: 'textarea',
    body: '<textarea rows="$1" cols="$2">$3</textarea>$4',
    description: 'Tag: `<textarea rows="" cols=""></textarea>`',
  },
  {
    prefix: 'tfoot',
    body: '<tfoot>$1</tfoot>',
    description: 'Tag: `<tfoot></tfoot>`',
  },
  {
    prefix: 'thead',
    body: '<thead>$1</thead>',
    description: 'Tag: `<thead></thead>`',
  },
  {
    prefix: 'th',
    body: '<th>$1</th>$2',
    description: 'Tag: `<th></th>`',
  },
  {
    prefix: 'tr',
    body: '<tr>$1</tr>$2',
    description: 'Tag: `<tr></tr>`',
  },
  {
    prefix: 'u',
    body: '<u>$1</u>$2',
    description: 'Tag: `<u></u>`',
  },
  {
    prefix: 'ul',
    body: '<ul>$1</ul>',
    description: 'Tag: `<ul></ul>`',
  },
]
