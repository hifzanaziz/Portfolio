/* Progressive enhancement: accessible case-study tabs and flow diagrams */
(() => {
  const items = {
    app: {
      number:"01 / 03", title:"Application / OAT → Store POS",
      subtitle:"Multi-channel order distribution with a direct Pay at POS status-update path.",
      tech:["API","Exchange Service","Payment Status"],
      stages:[
        ["📱","Application / OAT","Customer orders",""],
        ["🖥","App Server","Receives orders",""],
        ["🗄","Portal Server","POST order API · StoreID routing","service"],
        ["🔄","Exchange Service","Sends to target store","service"],
        ["🏬","Store Server / DB","Receives store order","store"],
        ["🧾","POS","Processes order / payment","pos"]
      ],
      links:["Order","API POST","StoreID","Sync","Display"],
      callback:"↩ PAY AT POS: Store Server directly calls App Server to update order status after POS payment.",
      rules:["Application and OAT orders pass through the App Server.","Portal uses StoreID from the payload to route each order.","Orders may arrive paid or unpaid.","If an unpaid order is paid at POS, Store Server calls App Server to update its status."],
      outcome:"Supports application and table ordering across stores, with a direct payment-status update for Pay at POS."
    },
    hr: {
      number:"02 / 03",title:"Rymnet HR → Portal → Store",
      subtitle:"Staff master data retrieval, staging, stored-procedure mapping and store distribution.",
      tech:["API GET","Stored Procedure","Exchange Service"],
      stages:[
        ["👥","Rymnet HR","Staff master / updates",""],
        ["🌐","Portal API Client","Calls Rymnet GET","service"],
        ["🗃","Staging Table","Stores API response",""],
        ["⚙️","Stored Procedure","Maps to existing Portal tables","service"],
        ["🗄","Portal DB","Updated required tables",""],
        ["🔄","Exchange → Store","Targeted store sync","store"]
      ],
      links:["API GET","Response","Trigger SP","Mapped","Exchange"],
      callback:"↩ API direction: The Portal initiates the GET request to Rymnet; Rymnet responds with available updates.",
      rules:["Portal initiates the API GET call to check for staff updates.","Returned data is saved in one staging table.","A stored procedure maps the data into existing required Portal tables.","Exchange Service distributes processed data to targeted stores."],
      outcome:"Provides a shared staff-data flow for Portal/POS access information and staff meal allowance requirements."
    },
    havi: {
      number:"03 / 03",title:"Inventory Ordering → HAVI",
      subtitle:"File-based supplier ordering using regional purchase order CSV files and SFTP.",
      tech:["CSV","SFTP","Regional Files"],
      stages:[
        ["🏬","CASA / Store","Inventory orders",""],
        ["🛒","EIOS Portal","Generates store POs",""],
        ["🗂","Regional Grouping","Peninsular · East MY · SG","service"],
        ["📄","CSV Generation","Required PO fields / filename",""],
        ["🔒","SFTP Transfer","Scheduled file exchange","service"],
        ["🚚","HAVI","Supplier order receiver","store"]
      ],
      links:["Order","PO","Split","CSV","SFTP"],
      callback:"ⓘ Regional file separation reflects the discussed enhancement scope; deployment status is not asserted.",
      rules:["EIOS generates a purchase order for each store.","CSV groups are separated by destination region.","Filename prefixes: NDM (Peninsular), ND2 (East Malaysia), ND2SG (Singapore).","File content remains ProposedOrderNo, StoreNumber, OrderDate, DeliveryDate, ItemID, ItemLocalNumber and OrderQuantity."],
      outcome:"Enables structured store purchase orders to be prepared for supplier delivery via SFTP."
    }
  };
  const tabs=[...document.querySelectorAll('[data-integration-tab]')];
  const view=document.getElementById('integration-view');
  if(!tabs.length||!view) return;
  const escapeHtml=(s)=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const contribution=[["💬","Requirement Discussions"],["🔎","Impact Analysis"],["🤝","Team Coordination"],["✅","Testing & Validation"]];
  function render(key){
    const d=items[key];if(!d)return;
    tabs.forEach(t=>{const active=t.dataset.integrationTab===key;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});
    const steps=d.stages.map((s,i)=>`<div class="integration-step"><div class="integration-node ${escapeHtml(s[3])}"><span class="integration-symbol" aria-hidden="true">${s[0]}</span><strong>${escapeHtml(s[1])}</strong><small>${escapeHtml(s[2])}</small></div></div>${i<d.links.length?`<div class="integration-link" aria-hidden="true"><span>${escapeHtml(d.links[i])}</span></div>`:''}`).join('');
    const roles=contribution.map(c=>`<div class="integration-role"><span aria-hidden="true">${c[0]}</span>${escapeHtml(c[1])}</div>`).join('');
    const rules=d.rules.map(r=>`<li>${escapeHtml(r)}</li>`).join('');
    view.innerHTML=`<div class="integration-title-row"><div><span class="integration-label">${d.number} · Integration Architecture</span><h3>${escapeHtml(d.title)}</h3><p>${escapeHtml(d.subtitle)}</p></div><div class="integration-meta">${d.tech.map(x=>`<span class="integration-pill">${escapeHtml(x)}</span>`).join('')}</div></div><div class="integration-diagram" role="group" aria-label="Integration steps, left to right"><div class="integration-flow">${steps}</div><p class="integration-flow-note"><span class="integration-return">${escapeHtml(d.callback.split(':')[0])}:</span><em>${escapeHtml(d.callback.split(':').slice(1).join(':').trim())}</em></p></div><div class="integration-casestudy-grid"><div class="integration-panel"><h4>My SA Contribution</h4><div class="integration-roles">${roles}</div></div><div class="integration-panel"><h4>Key Business & Integration Rules</h4><ul class="integration-rules">${rules}</ul></div></div><div class="integration-outcome"><strong>Business Value</strong> · ${escapeHtml(d.outcome)}</div><p class="integration-disclaimer">High-level, sanitized case studies. Diagrams describe confirmed flows and discussed requirements; they do not disclose internal endpoints, credentials or customer data. The SA contribution cards summarize involvement in discussions, impact analysis, coordination and testing; they do not imply sole development ownership.</p>`;
    view.setAttribute('aria-labelledby',tabs.find(t=>t.dataset.integrationTab===key).id);
  }
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>render(tab.dataset.integrationTab));tab.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'||e.key==='Home'||e.key==='End'){e.preventDefault();let index=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[index].focus();render(tabs[index].dataset.integrationTab);}})});
  render('app');
})();
