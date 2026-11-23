(function ($) {
  "use strict";

  let API_BASE = (localStorage.getItem("civicEventsApiUrl") || "http://localhost:4000").replace(/\/+$/, "");
  const TOKEN_KEY = "civicEventsToken";
  const USER_KEY = "civicEventsUser";
  const REGISTRATIONS_KEY = "civicEventsPreviewRegistrations";

  const eventPreviews = [
    {
      id: "preview-riverside-market",
      title: "Riverside Farmers Market",
      description: "Meet local growers, bakers, and makers at our weekly open-air market.",
      location: "Riverside Plaza",
      starts_at: "2025-06-14T09:00:00",
      ends_at: "2025-06-14T13:00:00",
      timeLabel: "9:00 AM–1:00 PM",
      image: "https://images.unsplash.com/photo-1789675143695-41597e7d86da?auto=format&fit=crop&w=1200&q=80",
      featured: true
    },
    {
      id: "preview-summer-concert",
      title: "Summer Concert in the Park",
      description: "Bring a blanket and enjoy an evening of live music with your neighbors.",
      location: "Cedar Grove Park",
      starts_at: "2025-06-18T18:30:00",
      ends_at: "2025-06-18T20:30:00",
      timeLabel: "6:30–8:30 PM",
      image: "https://images.unsplash.com/photo-1564520018910-537b326b9644?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "preview-garden-workshop",
      title: "Community Garden Workshop",
      description: "Learn practical techniques for growing vegetables in small urban spaces.",
      location: "Northside Library",
      starts_at: "2025-06-22T10:00:00",
      ends_at: "2025-06-22T11:30:00",
      timeLabel: "10:00–11:30 AM",
      image: "https://images.unsplash.com/photo-1777049645587-98ba4bfbe4e6?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "preview-historic-tour",
      title: "Historic District Walking Tour",
      description: "Discover the stories and architecture that shaped our city center.",
      location: "City Hall Steps",
      starts_at: "2025-06-27T17:30:00",
      ends_at: "2025-06-27T19:00:00",
      timeLabel: "5:30–7:00 PM",
      image: "https://images.unsplash.com/photo-1769034250772-43ac224fa852?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "preview-resource-fair",
      title: "Neighborhood Resource Fair",
      description: "Connect with city programs, nonprofits, and family services in one place.",
      location: "Eastside Community Center",
      starts_at: "2025-07-02T11:00:00",
      ends_at: "2025-07-02T15:00:00",
      timeLabel: "11:00 AM–3:00 PM",
      image: "https://images.unsplash.com/photo-1770174079619-461c19f3bf88?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "preview-arts-walk",
      title: "First Friday Arts Walk",
      description: "Explore local galleries, street performances, and late-night shops.",
      location: "Market Street",
      starts_at: "2025-07-05T17:00:00",
      ends_at: "2025-07-05T21:00:00",
      timeLabel: "5:00–9:00 PM",
      image: "https://images.unsplash.com/photo-1777049645587-98ba4bfbe4e6?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const announcementPreviews = [
    { id: "preview-street-maintenance", title: "Street maintenance update", length: "2:45", date: "June 10, 2025" },
    { id: "preview-city-manager", title: "A message from the city manager", length: "4:12", date: "June 6, 2025" },
    { id: "preview-library-program", title: "Library summer reading program", length: "1:38", date: "June 1, 2025" }
  ];

  const promoPreviews = [
    {
      id: "preview-greener-block",
      title: "A greener block, together",
      description: "Meet the neighbors transforming an empty lot.",
      image: "https://images.unsplash.com/photo-1777049645587-98ba4bfbe4e6?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "preview-library",
      title: "Inside the new Northside Library",
      description: "A welcoming place to read, learn, and gather.",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "preview-shop-local",
      title: "Shop local this summer",
      description: "Discover independent businesses downtown.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const iconPaths = {
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    play: '<path d="m8 5 12 7-12 7V5Z" fill="currentColor" stroke="none"/>',
    audio: '<path d="M11 5 6 9H3v6h3l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chart: '<path d="M4 19V5m0 14h17M8 15l4-4 3 2 5-6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>'
  };

  const state = {
    view: "events",
    events: eventPreviews.slice(),
    announcements: announcementPreviews.slice(),
    promos: promoPreviews.slice(),
    notifications: [],
    registeredEventIds: [],
    sources: { events: "preview", announcements: "preview", promos: "preview", dashboard: "preview", notifications: "preview" },
    user: readStoredObject(USER_KEY),
    token: sessionStorage.getItem(TOKEN_KEY) || "",
    eventSearch: "",
    dateFilter: "",
    locationFilter: "",
    adminStats: null,
    pendingEventId: null,
    previewMode: false
  };

  function readStoredObject(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key) || "null");
    } catch (error) {
      console.error("Could not read saved account data.", error);
      return null;
    }
  }

  function icon(name, className) {
    return '<svg class="' + (className || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (iconPaths[name] || "") + "</svg>";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function apiRequest(path, options) {
    const config = $.extend(true, {
      url: API_BASE + path,
      method: "GET",
      dataType: "json",
      headers: {}
    }, options || {});
    if (state.token) config.headers.Authorization = "Bearer " + state.token;
    return $.ajax(config);
  }

  function toast(message, isError) {
    const $toast = $('<div class="toast' + (isError ? " is-error" : "") + '" role="status"></div>').text(message);
    $("#toast-region").append($toast);
    window.setTimeout(function () { $toast.fadeOut(220, function () { $toast.remove(); }); }, 3800);
  }

  function setNavState() {
    $(".nav-link[data-view]").each(function () {
      $(this).toggleClass("is-active", $(this).data("view") === state.view);
    });
  }

  function updateProfile() {
    const name = state.user && state.user.full_name ? state.user.full_name : "Guest";
    const initials = name === "Guest" ? "G" : name.split(/\s+/).slice(0, 2).map(function (part) { return part.charAt(0); }).join("").toUpperCase();
    $("#profile-name").text(name);
    $("#profile-avatar").text(initials);
  }

  function isPreview() {
    return state.previewMode || (state.sources[state.view] || "preview") === "preview";
  }

  function formatDate(value) {
    if (!value) return { day: "TBA", month: "" };
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return { day: "TBA", month: "" };
    return { day: String(date.getDate()).padStart(2, "0"), month: date.toLocaleString("en-US", { month: "short" }).toUpperCase() };
  }

  function eventTime(event) {
    if (event.timeLabel) return event.timeLabel;
    if (!event.starts_at) return "Time to be announced";
    const start = new Date(event.starts_at);
    const end = event.ends_at ? new Date(event.ends_at) : null;
    const format = function (date) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: date.getMinutes() ? "2-digit" : undefined });
    };
    return format(start) + (end ? "–" + format(end) : "");
  }

  function eventImage(event, index) {
    const metadata = typeof event.metadata === "string" ? safeJson(event.metadata) : (event.metadata || {});
    return event.image || metadata.image_url || eventPreviews[index % eventPreviews.length].image;
  }

  function safeJson(value) {
    try { return JSON.parse(value); } catch (error) { return {}; }
  }

  function eventMatches(event) {
    const search = state.eventSearch.trim().toLowerCase();
    const haystack = [event.title, event.description, event.location].join(" ").toLowerCase();
    if (search && haystack.indexOf(search) === -1) return false;
    if (state.locationFilter) {
      const location = String(event.location || "").toLowerCase();
      if (state.locationFilter === "northside" && location.indexOf("northside") === -1) return false;
      if (state.locationFilter === "downtown" && !/(downtown|city hall|market street|riverside)/.test(location)) return false;
    }
    if (state.dateFilter && event.starts_at) {
      const eventDate = new Date(event.starts_at);
      const now = new Date();
      const limit = new Date(now);
      if (state.dateFilter === "week") limit.setDate(now.getDate() + 7);
      if (state.dateFilter === "month") limit.setMonth(now.getMonth() + 1);
      if (eventDate < new Date(now.getFullYear(), now.getMonth(), now.getDate()) || eventDate > limit) return false;
    }
    return true;
  }

  function renderEventCard(event, index) {
    const date = formatDate(event.starts_at);
    const registered = isPreview()
      ? getPreviewRegistrations().indexOf(event.id) !== -1
      : state.registeredEventIds.indexOf(String(event.id)) !== -1;
    const featured = event.featured ? '<span class="featured-tag">Featured</span>' : "";
    const eventId = escapeHtml(event.id);
    return '<article class="event-card" data-event-id="' + eventId + '">' +
      '<div class="event-image-wrap"><img class="event-image" src="' + escapeHtml(eventImage(event, index)) + '" alt="' + escapeHtml(event.title + " community event") + '" loading="lazy">' +
      '<div class="date-tile"><strong>' + escapeHtml(date.day) + '</strong><span>' + escapeHtml(date.month) + "</span></div>" + featured + "</div>" +
      '<div class="event-content"><h2 class="event-title">' + escapeHtml(event.title) + "</h2>" +
      '<p class="event-meta">' + icon("clock") + "<span>" + escapeHtml(eventTime(event)) + "</span></p>" +
      '<p class="event-meta">' + icon("pin") + "<span>" + escapeHtml(event.location || "Location to be announced") + "</span></p>" +
      '<p class="event-description">' + escapeHtml(event.description || "Join neighbors for a community event in Greenfield.") + "</p>" +
      '<div class="event-actions"><button class="btn-secondary" type="button" data-action="event-details" data-id="' + eventId + '">View details</button>' +
      '<button class="' + (registered ? "btn-secondary" : "btn-primary") + '" type="button" data-action="event-register" data-id="' + eventId + '">' + (registered ? "Registered" : "Register") + "</button></div></div></article>";
  }

  function renderEvents() {
    const events = state.events.filter(eventMatches);
    const cards = events.length ? events.map(renderEventCard).join("") :
      '<div class="event-empty"><p class="font-display text-2xl">No events found</p><p class="mt-2 text-sm text-slate">Try a different search or clear the filters.</p></div>';
    return '<section aria-labelledby="events-title">' +
      '<div class="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">' +
      '<div><p class="eyebrow">What’s happening</p><h1 class="page-title" id="events-title">Events in our city</h1><p class="page-subtitle">Gather, learn, and connect with your community.</p>' +
      (isPreview() ? '<span class="preview-note mt-4">Design preview · Sample events</span>' : "") + "</div>" +
      '<button class="btn-primary sm:mb-1" type="button" data-action="my-registrations">' + icon("calendar") + "My registrations</button></div>" +
      '<section class="filter-panel mb-8" aria-label="Event filters">' +
      '<div><label class="field-label" for="event-search">Search events</label><div class="input-wrap">' + icon("search") + '<input class="form-control" id="event-search" type="search" placeholder="Search events" value="' + escapeHtml(state.eventSearch) + '"></div></div>' +
      '<div><label class="field-label" for="date-filter">Date range</label><select class="form-control" id="date-filter"><option value="">Any date</option><option value="week"' + (state.dateFilter === "week" ? " selected" : "") + '>This week</option><option value="month"' + (state.dateFilter === "month" ? " selected" : "") + '>This month</option></select></div>' +
      '<div><label class="field-label" for="location-filter">Location</label><select class="form-control" id="location-filter"><option value="">All locations</option><option value="downtown"' + (state.locationFilter === "downtown" ? " selected" : "") + '>Downtown</option><option value="northside"' + (state.locationFilter === "northside" ? " selected" : "") + '>Northside</option></select></div>' +
      '<button class="btn-quiet filter-clear" type="button" data-action="clear-filters">Clear filters</button></section>' +
      '<div class="mb-4 flex items-center justify-between"><p class="text-sm text-slate">' + (isPreview() ? "Upcoming community events" : events.length + (events.length === 1 ? " event" : " events")) + '</p><p class="text-xs text-slate">' + (isPreview() ? "Preview content" : "City of Greenfield") + "</p></div>" +
      '<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">' + cards + "</div>" +
      '<nav class="mt-9 flex items-center justify-center gap-1" aria-label="Pagination"><button class="pagination-button" disabled aria-label="Previous page">‹</button><button class="pagination-button is-current" aria-current="page">1</button><button class="pagination-button" type="button" data-action="pagination">2</button><button class="pagination-button" type="button" data-action="pagination">3</button><span class="px-2 text-sm text-slate">…</span><button class="pagination-button" type="button" data-action="pagination">8</button><button class="pagination-button" type="button" data-action="pagination" aria-label="Next page">›</button></nav>' +
      "</section>";
  }

  function renderAnnouncements() {
    const announcements = state.announcements;
    const cards = announcements.length ? announcements.map(function (item) {
      const date = item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : (item.date || "City update");
      const audio = item.audio_url ? '<audio class="announcement-audio" controls preload="none" src="' + escapeHtml(item.audio_url) + '" aria-label="Listen to ' + escapeHtml(item.title) + '"></audio>' :
        '<button class="announcement-play" type="button" data-action="play-announcement" data-id="' + escapeHtml(item.id) + '" aria-label="Listen to ' + escapeHtml(item.title) + '">' + icon("play") + "</button>";
      return '<article class="announcement-card"><span class="announcement-icon">' + icon("audio") + '</span><div class="min-w-0 flex-1"><p class="eyebrow !text-[10px] !tracking-[.12em]">City announcement</p><h2 class="mt-1 font-display text-xl leading-tight">' + escapeHtml(item.title) + '</h2><p class="mt-2 text-xs text-slate">' + escapeHtml(item.length || "Audio update") + '<span class="mx-2 text-gray-300">·</span>' + escapeHtml(date) + "</p></div>" + audio + "</article>";
    }).join("") : '<div class="event-empty"><p class="font-display text-2xl">No announcements yet</p><p class="mt-2 text-sm text-slate">Check back for updates from the city.</p></div>';
    return '<section aria-labelledby="announcements-title"><div class="mb-8"><p class="eyebrow">Listen in</p><h1 class="page-title" id="announcements-title">Announcements</h1><p class="page-subtitle">Audio updates and messages from your city.</p>' +
      (isPreview() ? '<span class="preview-note mt-4">Design preview · Sample announcements</span>' : "") +
      '</div><div class="grid gap-4">' + cards + "</div></section>";
  }

  function renderPromos() {
    const promos = state.promos;
    const cards = promos.length ? promos.map(function (promo) {
      const preview = promoPreviews.find(function (item) { return item.id === promo.id; });
      const image = promo.thumbnail || (preview && preview.image) || promoPreviews[0].image;
      return '<article class="promo-card overflow-hidden"><button class="promo-image-wrap block w-full border-0 p-0 text-left" type="button" data-action="watch-promo" data-id="' + escapeHtml(promo.id) + '" aria-label="Play ' + escapeHtml(promo.title) + '">' +
        '<img class="promo-image" src="' + escapeHtml(image) + '" alt="' + escapeHtml(promo.title + " community story") + '" loading="lazy"><span class="promo-play">' + icon("play") + '</span><span class="absolute right-3 top-3 rounded bg-black/55 px-2 py-1 text-[10px] font-bold text-white">CC</span></button>' +
        '<div class="promo-copy"><h2 class="font-display text-xl">' + escapeHtml(promo.title) + '</h2><p class="mt-2 min-h-10 text-sm leading-6 text-slate">' + escapeHtml(promo.description || promo.caption_text || "A story from the Greenfield community.") + '</p><button class="btn-quiet mt-3 !px-0" type="button" data-action="watch-promo" data-id="' + escapeHtml(promo.id) + '">Watch story ' + icon("chevron") + "</button></div></article>";
    }).join("") : '<div class="event-empty"><p class="font-display text-2xl">No community stories yet</p><p class="mt-2 text-sm text-slate">New videos will appear here.</p></div>';
    return '<section aria-labelledby="promos-title"><div class="mb-8"><p class="eyebrow">City stories</p><h1 class="page-title" id="promos-title">Community promos</h1><p class="page-subtitle">Short films about the people and places shaping our city.</p>' +
      (isPreview() ? '<span class="preview-note mt-4">Design preview · Sample stories</span>' : "") +
      '</div><div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">' + cards + "</div></section>";
  }

  function statValue(path, fallback) {
    if (!state.adminStats) return fallback;
    const parts = path.split(".");
    let value = state.adminStats;
    for (let i = 0; i < parts.length; i++) value = value && value[parts[i]];
    return value == null ? fallback : Number(value).toLocaleString();
  }

  function renderDashboard() {
    const values = [
      { label: "Total events", value: statValue("events.total_events", "42"), note: "Across Greenfield", iconName: "calendar" },
      { label: "Total promos", value: statValue("promos.total_promos", "18"), note: "Community stories", iconName: "play" },
      { label: "Residents", value: statValue("users.total_users", "2,840"), note: "Registered accounts", iconName: "users" },
      { label: "Registrations", value: statValue("registrations.total_registrations", "1,206"), note: "Event sign-ups", iconName: "calendar" },
      { label: state.adminStats ? "Notifications" : "Unread notices", value: statValue("notifications.total_notifications", "17"), note: "Needs attention", iconName: "bell" }
    ];
    const stats = values.map(function (item) {
      return '<article class="stat-card"><div class="flex items-center justify-between"><p>' + escapeHtml(item.label) + '</p><span class="text-slate">' + icon(item.iconName, "h-5 w-5") + '</span></div><strong>' + escapeHtml(item.value) + '</strong><small>' + escapeHtml(item.note) + "</small></article>";
    }).join("");
    const bars = [["Market", 56], ["Concert", 76], ["Garden", 47], ["Tour", 62], ["Fair", 86], ["Arts", 66]].map(function (item) {
      return '<div class="chart-bar-group"><span class="chart-bar" style="height:' + item[1] + '%"></span><span>' + item[0] + "</span></div>";
    }).join("");
    const adminLinks = [
      ["chart", "Dashboard", "dashboard"],
      ["calendar", "Events", "events"],
      ["audio", "Announcements", "announcements"],
      ["play", "Promos", "promos"],
      ["bell", "Notifications", "notifications"]
    ].map(function (item) {
      return '<button type="button" data-view="' + item[2] + '"' + (state.view === item[2] ? ' class="is-active"' : "") + ">" + icon(item[0]) + escapeHtml(item[1]) + "</button>";
    }).join("");
    return '<section class="dashboard-layout" aria-label="City administration dashboard"><aside class="admin-sidebar"><div class="px-2 pb-3"><p class="eyebrow !text-[10px]">City admin</p><h2 class="mt-1 font-display text-2xl">Operations</h2></div><nav aria-label="Admin navigation">' + adminLinks + '</nav><div class="sidebar-note mt-5 border-t border-line px-2 pt-4"><p class="text-xs font-bold">Admin workspace</p><p class="mt-1 text-xs leading-5 text-slate">Changes are logged.</p></div></aside>' +
      '<div><div class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p class="eyebrow">' + (new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })) + '</p><h1 class="page-title !text-[40px]">Good morning, ' + escapeHtml((state.user && state.user.full_name || "Alex").split(" ")[0]) + '</h1><p class="page-subtitle">Here’s what’s happening across CivicEvents.</p>' +
      (isPreview() ? '<span class="preview-note mt-3">Design preview · Example dashboard figures</span>' : "") + '</div><button class="btn-primary" type="button" data-action="create-event">' + icon("plus") + "Create event</button></div>" +
      '<div class="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-5">' + stats + "</div>" +
      '<div class="mb-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]"><article class="dashboard-panel p-5"><div class="flex items-start justify-between"><div><p class="eyebrow !text-[10px]">Last 30 days</p><h2 class="mt-1 font-display text-2xl">Registrations by event</h2></div><select class="form-control !h-9 !w-auto !text-xs" aria-label="Chart date range"><option>Last 30 days</option><option>Last 90 days</option></select></div><div class="chart-bars mt-4" role="img" aria-label="Bar chart of registrations">' + bars + "</div></article>" +
      '<article class="dashboard-panel p-5"><div class="mb-2 flex items-center justify-between"><h2 class="font-display text-2xl">Recent activity</h2><button class="btn-quiet !min-h-8 !px-2 !text-xs" type="button" data-action="view-notifications">View all</button></div>' +
      '<div class="activity-row"><span class="activity-dot"></span><div><p class="text-sm font-semibold">New registration</p><p class="mt-1 text-xs text-slate">Riverside Farmers Market - 4m</p></div></div><div class="activity-row"><span class="activity-dot"></span><div><p class="text-sm font-semibold">Event updated</p><p class="mt-1 text-xs text-slate">Summer Concert - 24m</p></div></div><div class="activity-row"><span class="activity-dot"></span><div><p class="text-sm font-semibold">New resident account</p><p class="mt-1 text-xs text-slate">Taylor Kim - 1h</p></div></div><div class="activity-row"><span class="activity-dot"></span><div><p class="text-sm font-semibold">Announcement published</p><p class="mt-1 text-xs text-slate">Street maintenance - 3h</p></div></div></article></div>' +
      '<article class="dashboard-panel p-5"><div class="mb-4"><p class="eyebrow !text-[10px]">Trend</p><h2 class="mt-1 font-display text-2xl">Registrations over time</h2></div><div class="h-40 overflow-hidden rounded-lg bg-gradient-to-b from-moss/70 to-white p-3"><svg viewBox="0 0 720 140" class="h-full w-full" role="img" aria-label="Line chart showing registrations increasing over time"><path d="M0 114 C65 105, 75 82, 130 91 S195 115, 245 75 S305 68, 365 82 S430 47, 485 58 S555 41, 600 48 S660 14, 720 24" fill="none" stroke="#698171" stroke-width="3"/><path d="M0 114 C65 105, 75 82, 130 91 S195 115, 245 75 S305 68, 365 82 S430 47, 485 58 S555 41, 600 48 S660 14, 720 24 L720 140 L0 140Z" fill="url(#chart-fill)" opacity=".55"/><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#98ae9c"/><stop offset="1" stop-color="#fff"/></linearGradient></defs></svg></div></article></div></section>';
  }

  function renderNotifications() {
    const notifications = state.notifications;
    const content = notifications.length ? '<div class="grid gap-3">' + notifications.map(function (item) {
      const date = item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
      return '<article class="announcement-card"><span class="announcement-icon">' + icon("bell") + '</span><div><h2 class="font-display text-xl">' + escapeHtml(item.title) + '</h2><p class="mt-1 text-sm leading-6 text-slate">' + escapeHtml(item.message) + '</p><p class="mt-2 text-xs text-slate">' + escapeHtml(date) + "</p></div></article>";
    }).join("") + "</div>" : '<div class="event-empty"><span class="announcement-icon mx-auto">' + icon("bell") + '</span><p class="mt-4 font-display text-2xl">Your city updates</p><p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate">' + (state.token ? "You’re all caught up. New city updates will appear here." : "Sign in to see notifications for your account. New event and announcement updates will appear here.") + "</p>" + (state.token ? "" : '<button class="btn-primary mt-5" type="button" data-action="open-auth">Sign in</button>') + "</div>";
    return '<section><div class="mb-8"><p class="eyebrow">Stay in the loop</p><h1 class="page-title">Notifications</h1><p class="page-subtitle">Updates from your city and the community.</p>' + (isPreview() ? '<span class="preview-note mt-4">Design preview</span>' : "") + '</div>' + content + "</section>";
  }

  function render() {
    setNavState();
    updateProfile();
    let html = "";
    if (state.view === "events") html = renderEvents();
    else if (state.view === "announcements") html = renderAnnouncements();
    else if (state.view === "promos") html = renderPromos();
    else if (state.view === "notifications") html = renderNotifications();
    else html = renderDashboard();
    $("#view-root").html(html);
  }

  function getPreviewRegistrations() {
    try {
      const registrations = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY) || "[]");
      return Array.isArray(registrations) ? registrations : [];
    } catch (error) {
      console.error("Could not read preview registrations.", error);
      return [];
    }
  }

  function savePreviewRegistration(eventId, shouldRegister) {
    const registrations = getPreviewRegistrations();
    const next = shouldRegister ? registrations.concat(eventId) : registrations.filter(function (id) { return id !== eventId; });
    localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(Array.from(new Set(next))));
  }

  function openModal(content, label) {
    $("#modal-root").html('<div class="modal-backdrop" data-action="close-modal"><section class="modal-card" role="dialog" aria-modal="true" aria-label="' + escapeHtml(label) + '" tabindex="-1">' + content + "</section></div>");
    $("body").addClass("overflow-hidden");
    $("#modal-root .modal-card").trigger("focus");
  }

  function closeModal() {
    $("#modal-root").empty();
    $("body").removeClass("overflow-hidden");
    state.pendingEventId = null;
  }

  function authModal(mode, message) {
    const isSignup = mode === "signup";
    openModal('<button class="modal-close" type="button" data-action="close-modal" aria-label="Close">' + icon("close") + '</button><p class="eyebrow">' + (isSignup ? "Join the community" : "Welcome back") + '</p><h2 class="mt-2 font-display text-3xl">' + (isSignup ? "Create your account" : "Sign in to CivicEvents") + '</h2><p class="mt-2 text-sm leading-6 text-slate">Use your city account to register for events and access your dashboard.</p>' +
      (message ? '<p class="mt-3 rounded-lg bg-[#f3f5f3] px-3 py-2 text-xs text-slate">' + escapeHtml(message) + "</p>" : "") +
      '<form id="auth-form" class="mt-4" data-mode="' + (isSignup ? "signup" : "login") + '">' +
      (isSignup ? '<div class="modal-field"><label for="auth-name">Full name</label><input id="auth-name" name="full_name" autocomplete="name" required></div>' : "") +
      '<div class="modal-field"><label for="auth-email">Email</label><input id="auth-email" name="email" type="email" autocomplete="email" required></div><div class="modal-field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" autocomplete="' + (isSignup ? "new-password" : "current-password") + '" required' + (isSignup ? ' minlength="8"' : "") + "></div>" +
      '<button class="btn-primary mt-5 w-full" type="submit">' + (isSignup ? "Create account" : "Sign in") + '</button></form><p class="mt-4 text-center text-sm text-slate">' + (isSignup ? 'Already have an account? <button class="font-semibold text-forest underline" type="button" data-action="auth-switch" data-mode="login">Sign in</button>' : 'New to CivicEvents? <button class="font-semibold text-forest underline" type="button" data-action="auth-switch" data-mode="signup">Create an account</button>') + '</p><p class="mt-4 text-center text-[11px] leading-5 text-slate">API: ' + escapeHtml(API_BASE) + "</p>", isSignup ? "Create a CivicEvents account" : "Sign in to CivicEvents");
    const firstInput = $("#auth-email");
    if (firstInput.length) firstInput.trigger("focus");
  }

  function requestLoginForEvent(eventId) {
    state.pendingEventId = eventId;
    authModal("login", "Sign in to register for this event.");
  }

  function apiData(response) {
    return response && response.data !== undefined ? response.data : response;
  }

  async function loadLiveContent() {
    if (!state.token || state.previewMode) return;
    try {
      const response = await apiRequest("/api/events");
      const items = apiData(response);
      if (Array.isArray(items)) {
        state.events = items;
        state.sources.events = "live";
        render();
        try {
          const registrationsResponse = await apiRequest("/api/event-registrations/my-registrations");
          const registrations = apiData(registrationsResponse);
          state.registeredEventIds = Array.isArray(registrations)
            ? registrations.filter(function (item) { return item.status === "registered"; }).map(function (item) { return String(item.event_id); })
            : [];
          render();
        } catch (registrationError) {
          toast(registrationError.responseJSON && registrationError.responseJSON.message || "Could not load your registration status.", true);
        }
      }
    } catch (error) {
      toast(error.responseJSON && error.responseJSON.message || "Could not load live events. Preview content is still available.", true);
    }
  }

  async function loadAdminStats() {
    if (!state.token || state.previewMode || !state.user || state.user.role !== "admin") return;
    try {
      const response = await apiRequest("/api/dashboard/admin");
      state.adminStats = apiData(response);
      state.sources.dashboard = "live";
      render();
    } catch (error) {
      toast(error.responseJSON && error.responseJSON.message || "Could not load dashboard statistics.", true);
    }
  }

  async function loadSectionContent(view) {
    if (!state.token || state.previewMode) return;
    const path = view === "announcements" ? "/api/announcements" : view === "promos" ? "/api/promos" : "/api/notifications";
    try {
      const response = await apiRequest(path);
      const items = apiData(response);
      if (Array.isArray(items)) {
        if (view === "announcements") state.announcements = items;
        else if (view === "promos") state.promos = items;
        else state.notifications = items;
        state.sources[view] = "live";
        render();
      }
    } catch (error) {
      toast(error.responseJSON && error.responseJSON.message || "Could not load live content. Preview content is still available.", true);
    }
  }

  function goTo(view) {
    if (view === "dashboard" && state.token && (!state.user || state.user.role !== "admin")) {
      toast("The city dashboard is available to administrator accounts.", true);
      view = "events";
    }
    state.view = view;
    $(".header-popover").addClass("hidden").empty();
    render();
    if (!state.previewMode) {
      if (view === "events") loadLiveContent();
      if (view === "announcements" || view === "promos" || view === "notifications") loadSectionContent(view);
      if (view === "dashboard") loadAdminStats();
    }
    $("#main-content").trigger("focus");
  }

  function openEventDetails(eventId) {
    const event = state.events.find(function (item) { return String(item.id) === String(eventId); });
    if (!event) return;
    const image = eventImage(event, 0);
    const date = formatDate(event.starts_at);
    openModal('<button class="modal-close" type="button" data-action="close-modal" aria-label="Close">' + icon("close") + '</button><img class="mb-5 h-48 w-full rounded-lg object-cover" src="' + escapeHtml(image) + '" alt="' + escapeHtml(event.title) + '">' +
      '<p class="eyebrow">' + escapeHtml(date.month + " " + date.day) + '</p><h2 class="mt-2 font-display text-3xl">' + escapeHtml(event.title) + '</h2><p class="mt-4 text-sm leading-6 text-slate">' + escapeHtml(event.description || "Join neighbors for a community event in Greenfield.") + '</p><div class="mt-4 grid gap-2 text-sm text-slate"><p>' + icon("clock") + " " + escapeHtml(eventTime(event)) + '</p><p>' + icon("pin") + " " + escapeHtml(event.location || "Location to be announced") + '</p></div><button class="btn-primary mt-6 w-full" type="button" data-action="event-register" data-id="' + escapeHtml(event.id) + '">Register for this event</button>', "Event details");
  }

  async function registerEvent(eventId) {
    if (isPreview()) {
      const registered = getPreviewRegistrations().indexOf(eventId) !== -1;
      savePreviewRegistration(eventId, !registered);
      closeModal();
      render();
      toast(registered ? "Preview registration cancelled." : "You’re registered in this local preview.");
      return;
    }
    if (!state.token) {
      requestLoginForEvent(eventId);
      return;
    }
    try {
      const registered = state.registeredEventIds.indexOf(String(eventId)) !== -1;
      const path = registered ? "/api/event-registrations/cancel" : "/api/event-registrations/register";
      await apiRequest(path, { method: "POST", contentType: "application/json", data: JSON.stringify({ event_id: eventId }) });
      state.registeredEventIds = registered
        ? state.registeredEventIds.filter(function (id) { return id !== String(eventId); })
        : state.registeredEventIds.concat(String(eventId));
      closeModal();
      render();
      toast(registered ? "Registration cancelled." : "You’re registered for this event.");
    } catch (error) {
      if (error.status === 401) {
        state.token = "";
        sessionStorage.removeItem(TOKEN_KEY);
        requestLoginForEvent(eventId);
      } else {
        toast(error.responseJSON && error.responseJSON.message || "Could not update your registration.", true);
      }
    }
  }

  async function showMyRegistrations() {
    if (isPreview()) {
      const ids = getPreviewRegistrations();
      const registrations = state.events.filter(function (event) { return ids.indexOf(event.id) !== -1; });
      const body = registrations.length ? '<ul class="mt-5 divide-y divide-line">' + registrations.map(function (event) {
        const date = formatDate(event.starts_at);
        return '<li class="flex items-center justify-between gap-3 py-4"><div><p class="font-semibold">' + escapeHtml(event.title) + '</p><p class="mt-1 text-xs text-slate">' + escapeHtml(date.month + " " + date.day + " · " + event.location) + '</p></div><button class="btn-quiet !min-h-8 !text-xs" type="button" data-action="event-register" data-id="' + escapeHtml(event.id) + '">Cancel</button></li>';
      }).join("") + "</ul>" : '<div class="mt-5 rounded-lg bg-paper p-6 text-center text-sm text-slate">You haven’t registered for any preview events yet.</div>';
      openModal('<button class="modal-close" type="button" data-action="close-modal" aria-label="Close">' + icon("close") + '</button><p class="eyebrow">Your city calendar</p><h2 class="mt-2 font-display text-3xl">My registrations</h2>' + body, "My registrations");
      return;
    }
    if (!state.token) {
      authModal("login", "Sign in to see your event registrations.");
      return;
    }
    try {
      const response = await apiRequest("/api/event-registrations/my-registrations");
      const items = apiData(response);
      const content = Array.isArray(items) && items.length ? '<ul class="mt-5 divide-y divide-line">' + items.map(function (item) {
        const date = item.starts_at ? new Date(item.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Date to be announced";
        return '<li class="py-4"><p class="font-semibold">' + escapeHtml(item.title) + '</p><p class="mt-1 text-xs text-slate">' + escapeHtml(date + " · " + (item.location || "Location to be announced")) + "</p></li>";
      }).join("") + "</ul>" : '<p class="mt-5 rounded-lg bg-paper p-5 text-sm text-slate">You have no event registrations yet.</p>';
      openModal('<button class="modal-close" type="button" data-action="close-modal" aria-label="Close">' + icon("close") + '</button><p class="eyebrow">Your city calendar</p><h2 class="mt-2 font-display text-3xl">My registrations</h2>' + content, "My registrations");
    } catch (error) {
      toast(error.responseJSON && error.responseJSON.message || "Could not load your registrations.", true);
    }
  }

  function showPromo(promoId) {
    const promo = state.promos.find(function (item) { return String(item.id) === String(promoId); });
    if (!promo) return;
    const video = promo.video_url ? '<video class="mt-5 w-full rounded-lg bg-black" controls src="' + escapeHtml(promo.video_url) + '" poster="' + escapeHtml(promo.thumbnail || promoPreviews[0].image) + '"></video>' :
      '<div class="mt-5 rounded-lg bg-paper p-5 text-center text-sm text-slate">Video playback is available when you’re connected to the city content library.</div>';
    openModal('<button class="modal-close" type="button" data-action="close-modal" aria-label="Close">' + icon("close") + '</button><p class="eyebrow">Community story</p><h2 class="mt-2 font-display text-3xl">' + escapeHtml(promo.title) + '</h2><p class="mt-3 text-sm leading-6 text-slate">' + escapeHtml(promo.description || promo.caption_text || "") + "</p>" + video, "Community story");
  }

  function renderPopover(kind) {
    const $popover = $(".header-popover");
    let content = "";
    if (kind === "profile") {
      content = '<p class="popover-title">' + (state.user ? escapeHtml(state.user.full_name) : "Your account") + '</p>' +
        (state.user ? '<p class="px-3 pb-2 text-xs text-slate">' + escapeHtml(state.user.email || "") + '</p><button class="menu-item" type="button" data-action="sign-out">Sign out</button>' : '<button class="menu-item" type="button" data-action="open-auth">Sign in or create an account</button>') +
        '<button class="menu-item" type="button" data-action="api-settings">API connection settings</button>' +
        '<button class="menu-item" type="button" data-action="switch-preview">Return to design preview</button>';
    } else if (kind === "notifications") {
      content = '<p class="popover-title">Notifications</p><p class="px-3 py-3 text-sm leading-6 text-slate">' + (state.user ? "You’re all caught up. New city updates will appear here." : "Sign in to see notifications for your account.") + '</p>' + (state.user ? "" : '<button class="menu-item" type="button" data-action="open-auth">Sign in</button>');
    } else {
      content = '<p class="popover-title">Quick links</p><button class="menu-item" type="button" data-view="events">Browse events</button><button class="menu-item" type="button" data-view="announcements">Listen to announcements</button><button class="menu-item" type="button" data-view="promos">Watch community stories</button><button class="menu-item" type="button" data-action="api-settings">API connection settings</button>';
    }
    $popover.html(content).removeClass("hidden");
  }

  function openApiSettings() {
    openModal('<button class="modal-close" type="button" data-action="close-modal" aria-label="Close">' + icon("close") + '</button><p class="eyebrow">Connection</p><h2 class="mt-2 font-display text-3xl">API settings</h2><p class="mt-2 text-sm leading-6 text-slate">Connect this page to your CivicEvents backend. The default address is localhost:4000.</p><form id="api-settings-form" class="mt-4"><div class="modal-field"><label for="api-url">Backend URL</label><input id="api-url" name="api_url" type="url" required value="' + escapeHtml(API_BASE) + '"></div><button class="btn-primary mt-5 w-full" type="submit">Save connection</button></form>', "API settings");
  }

  function openCreateEvent() {
    if (!state.user || state.user.role !== "admin") {
      toast("Sign in with an administrator account to create an event.", true);
      if (!state.token) authModal("login");
      return;
    }
    openModal('<button class="modal-close" type="button" data-action="close-modal" aria-label="Close">' + icon("close") + '</button><p class="eyebrow">City admin</p><h2 class="mt-2 font-display text-3xl">Create an event</h2><form id="create-event-form" class="mt-3" enctype="multipart/form-data">' +
      '<div class="modal-field"><label for="new-event-title">Event title</label><input id="new-event-title" name="title" required></div><div class="modal-field"><label for="new-event-description">Description</label><textarea id="new-event-description" name="description"></textarea></div><div class="modal-field"><label for="new-event-location">Location</label><input id="new-event-location" name="location" required></div><div class="modal-form-row"><div class="modal-field"><label for="new-event-start">Starts</label><input id="new-event-start" name="starts_at" type="datetime-local" required></div><div class="modal-field"><label for="new-event-end">Ends</label><input id="new-event-end" name="ends_at" type="datetime-local" required></div></div><div class="modal-field"><label for="new-event-image">Event image (optional)</label><input id="new-event-image" name="image" type="file" accept="image/*"></div><button class="btn-primary mt-5 w-full" type="submit">Publish event</button></form>', "Create event");
  }

  $(document).on("click", "[data-view]", function () {
    goTo($(this).data("view"));
  });

  $(document).on("click", "[data-action]", function (event) {
    const action = $(this).data("action");
    const id = $(this).data("id");
    if (action !== "global-search" && action !== "auth-switch") event.preventDefault();
    if (action === "global-search") {
      if (state.view !== "events") goTo("events");
      window.setTimeout(function () { $("#event-search").trigger("focus"); }, 0);
    } else if (action === "profile" || action === "notifications" || action === "more-menu") {
      const kind = action === "profile" ? "profile" : action === "notifications" ? "notifications" : "more";
      if (!$(".header-popover").hasClass("hidden") && $(".header-popover").data("kind") === kind) {
        $(".header-popover").addClass("hidden").empty();
      } else {
        renderPopover(kind);
        $(".header-popover").data("kind", kind);
      }
    } else if (action === "clear-filters") {
      state.eventSearch = "";
      state.dateFilter = "";
      state.locationFilter = "";
      render();
    } else if (action === "event-details") {
      openEventDetails(id);
    } else if (action === "event-register") {
      registerEvent(String(id));
    } else if (action === "my-registrations") {
      showMyRegistrations();
    } else if (action === "close-modal") {
      if ($(event.target).closest(".modal-card").length === 0 || $(this).closest(".modal-card").length) closeModal();
    } else if (action === "auth-switch") {
      authModal($(this).data("mode"));
    } else if (action === "open-auth") {
      authModal("login");
    } else if (action === "sign-out") {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      state.token = "";
      state.user = null;
      state.previewMode = true;
      state.sources = { events: "preview", announcements: "preview", promos: "preview", dashboard: "preview", notifications: "preview" };
      state.events = eventPreviews.slice();
      state.announcements = announcementPreviews.slice();
      state.promos = promoPreviews.slice();
      state.notifications = [];
      state.registeredEventIds = [];
      state.adminStats = null;
      $(".header-popover").addClass("hidden").empty();
      render();
      toast("You’ve signed out. The design preview is active.");
    } else if (action === "switch-preview") {
      state.previewMode = true;
      state.sources = { events: "preview", announcements: "preview", promos: "preview", dashboard: "preview", notifications: "preview" };
      state.events = eventPreviews.slice();
      state.announcements = announcementPreviews.slice();
      state.promos = promoPreviews.slice();
      state.notifications = [];
      state.registeredEventIds = [];
      state.adminStats = null;
      $(".header-popover").addClass("hidden").empty();
      render();
      toast("Design preview content is active.");
    } else if (action === "api-settings") {
      $(".header-popover").addClass("hidden").empty();
      openApiSettings();
    } else if (action === "play-announcement") {
      toast("Audio playback is available for announcements loaded from the city API.");
    } else if (action === "watch-promo") {
      showPromo(String(id));
    } else if (action === "create-event") {
      openCreateEvent();
    } else if (action === "view-notifications") {
      goTo("notifications");
    } else if (action === "pagination") {
      toast("More events will be available when connected to the city event feed.");
    }
  });

  $(document).on("input", "#event-search", function () {
    state.eventSearch = $(this).val();
    const selectionStart = this.selectionStart;
    const selectionEnd = this.selectionEnd;
    render();
    const input = $("#event-search").get(0);
    if (input) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
  });

  $(document).on("change", "#date-filter", function () {
    state.dateFilter = $(this).val();
    render();
  });

  $(document).on("change", "#location-filter", function () {
    state.locationFilter = $(this).val();
    render();
  });

  $(document).on("submit", "#auth-form", async function (event) {
    event.preventDefault();
    const form = this;
    const mode = $(form).data("mode");
    const data = Object.fromEntries(new FormData(form).entries());
    const $submit = $(form).find('[type="submit"]').prop("disabled", true).text("Please wait…");
    try {
      if (mode === "signup") {
        await apiRequest("/api/auth/signup", { method: "POST", contentType: "application/json", data: JSON.stringify(data) });
        authModal("login", "Account created. Sign in to continue.");
        $("#auth-email").val(data.email);
        return;
      }
      const response = await apiRequest("/api/auth/login", { method: "POST", contentType: "application/json", data: JSON.stringify(data) });
      const result = apiData(response);
      if (!result || !result.token || !result.user) throw new Error("The API returned an invalid sign-in response.");
      state.token = result.token;
      state.user = result.user;
      state.previewMode = false;
      sessionStorage.setItem(TOKEN_KEY, state.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(state.user));
      const pendingEventId = state.pendingEventId;
      closeModal();
      updateProfile();
      toast("Welcome, " + state.user.full_name + ".");
      if (state.view === "events") await loadLiveContent();
      if (state.view === "announcements" || state.view === "promos") await loadSectionContent(state.view);
      if (state.view === "dashboard") await loadAdminStats();
      if (pendingEventId && !String(pendingEventId).startsWith("preview-")) await registerEvent(pendingEventId);
    } catch (error) {
      const message = error.responseJSON && error.responseJSON.message || error.message || "Could not sign in. Check that the backend is running.";
      toast(message, true);
      $submit.prop("disabled", false).text(mode === "signup" ? "Create account" : "Sign in");
    }
  });

  $(document).on("submit", "#api-settings-form", function (event) {
    event.preventDefault();
    const url = String(new FormData(this).get("api_url") || "").replace(/\/+$/, "");
    try {
      const parsed = new URL(url);
      if (!/^https?:$/.test(parsed.protocol)) throw new Error("Use an http or https address.");
      localStorage.setItem("civicEventsApiUrl", url);
      API_BASE = url;
      closeModal();
      toast("API connection saved. Sign in to load live city content.");
    } catch (error) {
      toast(error.message || "Enter a valid backend URL.", true);
    }
  });

  $(document).on("submit", "#create-event-form", async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    try {
      await apiRequest("/api/events", { method: "POST", data: formData, processData: false, contentType: false });
      closeModal();
      toast("Event created successfully.");
      state.view = "events";
      await loadLiveContent();
    } catch (error) {
      toast(error.responseJSON && error.responseJSON.message || "Could not create the event.", true);
    }
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest(".header-actions, .header-popover").length) {
      $(".header-popover").addClass("hidden").empty();
    }
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      if ($("#modal-root").children().length) closeModal();
      $(".header-popover").addClass("hidden").empty();
    }
  });

  render();
  if (state.token && state.user) {
    loadLiveContent();
  } else {
    updateProfile();
  }
})(jQuery);
