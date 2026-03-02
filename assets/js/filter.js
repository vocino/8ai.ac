(function () {
  "use strict";

  const ARRAY_FIELDS = ["categories", "use_cases", "modalities"];
  const STRING_FIELDS = ["pricing"];
  const BOOL_FIELDS = ["api", "self_hosted"];
  const ALL_FILTER_FIELDS = [...ARRAY_FIELDS, ...STRING_FIELDS, ...BOOL_FIELDS];

  let allCards = [];
  let searchBox, resultsCount, sortSelect, clearFiltersBtn;

  function init() {
    allCards = Array.from(document.querySelectorAll(".tool-card"));
    searchBox = document.getElementById("searchBox");
    resultsCount = document.getElementById("resultsCount");
    sortSelect = document.getElementById("sortSelect");
    clearFiltersBtn = document.getElementById("clearFiltersBtn");

    document.querySelectorAll(".filter-section__header").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var section = btn.closest(".filter-section");
        section.classList.toggle("is-collapsed");
        btn.setAttribute("aria-expanded", section.classList.contains("is-collapsed") ? "false" : "true");
      });
    });

    if (!allCards.length) return;

    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener("change", onFilterChange);
    });

    if (searchBox) {
      searchBox.addEventListener("input", debounce(onFilterChange, 200));
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", onFilterChange);
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", clearFilters);
    }

    restoreFromURL();
    applyFilters();
  }

  function getActiveFilters() {
    var filters = {};
    ALL_FILTER_FIELDS.forEach(function (field) {
      filters[field] = [];
    });

    document.querySelectorAll('.filter-sidebar input[type="checkbox"]:checked').forEach(function (cb) {
      var name = cb.name;
      var val = cb.value;
      if (filters[name] !== undefined) {
        filters[name].push(val);
      }
    });

    return filters;
  }

  function matchesFilters(card, filters, query) {
    if (query) {
      var name = (card.dataset.name || "").toLowerCase();
      var desc = (card.dataset.description || "").toLowerCase();
      if (name.indexOf(query) === -1 && desc.indexOf(query) === -1) {
        return false;
      }
    }

    for (var i = 0; i < ARRAY_FIELDS.length; i++) {
      var field = ARRAY_FIELDS[i];
      if (filters[field].length === 0) continue;

      var attr = field === "use_cases" ? "useCases" : field;
      var cardVals = (card.dataset[attr] || "").split(",").filter(Boolean);
      var hasMatch = false;
      for (var j = 0; j < filters[field].length; j++) {
        if (cardVals.indexOf(filters[field][j]) !== -1) {
          hasMatch = true;
          break;
        }
      }
      if (!hasMatch) return false;
    }

    for (var i = 0; i < STRING_FIELDS.length; i++) {
      var field = STRING_FIELDS[i];
      if (filters[field].length === 0) continue;
      var val = card.dataset[field] || "";
      if (filters[field].indexOf(val) === -1) return false;
    }

    for (var i = 0; i < BOOL_FIELDS.length; i++) {
      var field = BOOL_FIELDS[i];
      if (filters[field].length === 0) continue;
      var attr = field === "self_hosted" ? "selfHosted" : field;
      var val = card.dataset[attr];
      if (val !== "true") return false;
    }

    return true;
  }

  function applyFilters() {
    var filters = getActiveFilters();
    var query = searchBox ? searchBox.value.toLowerCase().trim() : "";
    var visible = 0;

    allCards.forEach(function (card) {
      var show = matchesFilters(card, filters, query);
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    if (resultsCount) {
      resultsCount.innerHTML = "Showing <strong>" + visible + "</strong> of <strong>" + allCards.length + "</strong> tools";
    }

    var hasAnyFilter = Object.keys(filters).some(function (k) { return filters[k].length > 0; }) || (searchBox && searchBox.value.trim().length > 0);
    if (clearFiltersBtn) {
      clearFiltersBtn.style.display = hasAnyFilter ? "" : "none";
    }

    updateCounts(filters, query);
    sortCards();
    updateURL(filters, query);
    toggleEmptyState(visible);
  }

  function updateCounts(currentFilters, query) {
    document.querySelectorAll("[data-count-for]").forEach(function (el) {
      var parts = el.dataset.countFor.split(":");
      var field = parts[0];
      var value = parts[1];
      var count = 0;

      var testFilters = {};
      ALL_FILTER_FIELDS.forEach(function (f) {
        testFilters[f] = f === field ? [value] : currentFilters[f].slice();
      });

      allCards.forEach(function (card) {
        if (matchesFilters(card, testFilters, query)) count++;
      });

      el.textContent = count;
    });
  }

  function sortCards() {
    if (!sortSelect) return;
    var grid = document.querySelector(".tools-grid");
    if (!grid) return;

    var order = sortSelect.value;
    var visible = allCards.filter(function (c) { return c.style.display !== "none"; });

    visible.sort(function (a, b) {
      if (order === "name-asc") {
        return (a.dataset.name || "").localeCompare(b.dataset.name || "");
      }
      if (order === "name-desc") {
        return (b.dataset.name || "").localeCompare(a.dataset.name || "");
      }
      if (order === "newest") {
        return (b.dataset.launch || "").localeCompare(a.dataset.launch || "");
      }
      return 0;
    });

    visible.forEach(function (card) { grid.appendChild(card); });
  }

  function updateURL(filters, query) {
    var params = new URLSearchParams();
    ALL_FILTER_FIELDS.forEach(function (field) {
      if (filters[field].length > 0) {
        params.set(field, filters[field].join(","));
      }
    });
    if (query) params.set("q", query);

    var qs = params.toString();
    var url = window.location.pathname + (qs ? "?" + qs : "");
    history.replaceState(null, "", url);
  }

  function restoreFromURL() {
    var params = new URLSearchParams(window.location.search);

    ALL_FILTER_FIELDS.forEach(function (field) {
      var val = params.get(field);
      if (!val) return;
      var values = val.split(",");
      values.forEach(function (v) {
        var cb = document.querySelector(
          '.filter-sidebar input[name="' + field + '"][value="' + v + '"]'
        );
        if (cb) cb.checked = true;
      });
    });

    var q = params.get("q");
    if (q && searchBox) searchBox.value = q;

    var sort = params.get("sort");
    if (sort && sortSelect) sortSelect.value = sort;
  }

  function toggleEmptyState(visibleCount) {
    var empty = document.getElementById("emptyState");
    if (empty) {
      empty.style.display = visibleCount === 0 ? "" : "none";
    }
  }

  function onFilterChange() {
    applyFilters();
  }

  function clearFilters() {
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(function (cb) {
      cb.checked = false;
    });
    if (searchBox) searchBox.value = "";
    applyFilters();
  }

  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  /* Mobile sidebar toggle */
  window.openSidebar = function () {
    document.getElementById("filterSidebar").classList.add("is-open");
    document.getElementById("filterOverlay").classList.add("is-open");
  };

  window.closeSidebar = function () {
    document.getElementById("filterSidebar").classList.remove("is-open");
    document.getElementById("filterOverlay").classList.remove("is-open");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
