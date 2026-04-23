$(window).on("load", function () {
  document.querySelectorAll("d-footnote").forEach(function (footnote) {
    footnote.shadowRoot.querySelector("sup > span").setAttribute("style", "color: var(--global-theme-color);");
    footnote.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {background-color: var(--global-bg-color) !important;}");
    footnote.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {border-color: var(--global-divider-color) !important;}");
  });
  // Append a single column to d-byline containing stacked sections
  // (PDF, Code, Cite) — each with its own h3 header — alongside Published.
  var byline = document.querySelector("d-byline .byline.grid");
  var citationEl = document.getElementById("citation");
  if (byline) {
    var links = window.distillBylineLinks || {};
    var sections = [];

    if (links.paperURL) {
      sections.push(
        '<h3>PDF</h3><p><a href="' + links.paperURL + '" target="_blank" rel="noopener">' + (links.paperText || "PDF") + '</a></p>'
      );
    }
    if (links.codeURL) {
      sections.push(
        '<h3>Code</h3><p><a href="' + links.codeURL + '" target="_blank" rel="noopener">' + (links.codeText || "Code") + '</a></p>'
      );
    }
    if (citationEl) {
      sections.push(
        '<h3>Cite</h3><p><a class="cite-link" href="#citation">Cite this work</a></p>'
      );
    }

    if (sections.length > 0) {
      var linksCol = document.createElement("div");
      linksCol.innerHTML = sections.join("");
      byline.appendChild(linksCol);

      var citeLink = linksCol.querySelector(".cite-link");
      if (citeLink && citationEl) {
        citationEl.style.scrollMarginTop = "80px";
        citeLink.addEventListener("click", function (e) {
          e.preventDefault();
          citationEl.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(function () {
            citationEl.scrollIntoView({ behavior: "auto", block: "start" });
          }, 700);
        });
      }
    }
  }

  // Override styles of the citations.
  document.querySelectorAll("d-cite").forEach(function (cite) {
    cite.shadowRoot.querySelector("div > span").setAttribute("style", "color: var(--global-theme-color);");
    cite.shadowRoot.querySelector("style").sheet.insertRule("ul li a {color: var(--global-text-color) !important; text-decoration: none;}");
    cite.shadowRoot.querySelector("style").sheet.insertRule("ul li a:hover {color: var(--global-theme-color) !important;}");
    cite.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {background-color: var(--global-bg-color) !important;}");
    cite.shadowRoot
      .querySelector("d-hover-box")
      .shadowRoot.querySelector("style")
      .sheet.insertRule(".panel {border-color: var(--global-divider-color) !important;}");
  });
});
