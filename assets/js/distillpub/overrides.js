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
  // Add Cite button into d-byline, replacing the DOI column.
  var byline = document.querySelector("d-byline .byline.grid");
  var citationEl = document.getElementById("citation");
  if (byline && citationEl) {
    // Find and replace the DOI div (last child of .byline.grid)
    var doiDiv = byline.querySelector("div:last-child");
    if (doiDiv) {
      doiDiv.innerHTML = '<h3>Cite</h3><p><a class="cite-link" href="#citation">Cite this work</a></p>';
      citationEl.style.scrollMarginTop = "80px";
      doiDiv.querySelector(".cite-link").addEventListener("click", function(e) {
        e.preventDefault();
        citationEl.scrollIntoView({ behavior: "smooth" });
      });
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
