// Using a new help.js as the old one would need a full rewrite

function addTabFunctionality() {
	const tabs = document.querySelectorAll("section.xp-tabs > menu[role=tablist]");

	for (let i = 0; i < tabs.length; i++) {
	  const tab = tabs[i];
	
	  const tabButtons = tab.querySelectorAll("menu[role=tablist] > button");
	
	  tabButtons.forEach((btn) =>
		btn.addEventListener("click", (e) => {
		  e.preventDefault();
	
		  tabButtons.forEach((button) => {
			if (
			  button.getAttribute("aria-controls") ===
			  e.target.getAttribute("aria-controls")
			) {
			  button.setAttribute("aria-selected", true);
			  openTab(e, tab);
			} else {
			  button.setAttribute("aria-selected", false);
			}
		  });
		})
	  );
	}
}

function openTab(event, tab) {
  const articles = tab.parentNode.querySelectorAll('[role="tabpanel"]');
  articles.forEach((p) => {
    p.setAttribute("hidden", true);
  });
  const article = tab.parentNode.querySelector(
    `[role="tabpanel"]#${event.target.getAttribute("aria-controls")}`
  );
  article.removeAttribute("hidden");
}



function show_help() {
	const $w = new $FormToolWindow("About XP Paint");

	let aboutWindowBody = `
	<div id="HelpTopPanel" style="background-color: white; display: flex;">
		<div id="HideButton" style="padding: 8px;">
			<div><img src="${HELP_HIDE_BUTTON_BASE64}" style="width: 32px; height: 32px; image-rendering: crips-edges"></div>
			<div>Hide</div>
		</div>
		<div id="BackButton" style="padding: 8px;">
			<div><img src="${HELP_BACK_BUTTON_BASE64}" style="width: 32px; height: 32px; image-rendering: crips-edges"></div>
			<div>Back</div>
		</div>
		<div id="ForwardButton" style="padding: 8px;">
			<div><img src="${HELP_FORWARD_BUTTON_BASE64}" style="width: 32px; height: 32px; image-rendering: crips-edges"></div>
			<div>Forward</div>
		</div>
		<div id="OptionsButton" style="padding: 8px;">
			<div><img src="${HELP_OPTIONS_BUTTON_BASE64}" style="width: 32px; height: 32px; image-rendering: crips-edges"></div>
			<div>Options</div>
		</div>
	</div>

	<div id="HelpBottomPanel" style="display: flex">
		<div id="HelpLeftPanel" style="margin-top: 12px;">
			<section class="xp-tabs" style="width: 250px;">
				<menu role="tablist" aria-label="Sample Tabs">
					<button role="tab" aria-selected="true" aria-controls="tab-A">Contents</button>
					<button role="tab" aria-controls="tab-B">Index</button>
					<button role="tab" aria-controls="tab-C">Search</button>
				</menu>
			
				<article role="tabpanel" id="tab-A" style="padding: 10px; margin-right: 4px; height: 360px">
					<div style="border: 1px solid gray; background-color: white;">
						<div style="margin: 1px; border-top: 1px solid gray; border-left: 1px solid gray; height: 358px">
							<div style="padding-left: 3px;">To be implemented</div>
						</div>
					</div>
				</article>

				<article role="tabpanel" id="tab-B" hidden="true" style="padding: 10px; margin-right: 4px; height: 360px">
					<div style="border: 1px solid gray; background-color: white;">
						<div style="margin: 1px; border-top: 1px solid gray; border-left: 1px solid gray; height: 358px">
							<div style="padding-left: 3px;">This isn't yet implemented either</div>
						</div>
					</div>
				</article>

				<article role="tabpanel" id="tab-C" hidden="true" style="padding: 10px; margin-right: 4px; height: 360px">
					<div style="border: 1px solid gray; background-color: white;">
						<div style="margin: 1px; border-top: 1px solid gray; border-left: 1px solid gray; height: 358px">
							<div style="padding-left: 3px;">Also not implemented</div>
						</div>
					</div>
				</article>
			</section>
		</div>

		<div id="HelpRightPanel" style="width: 400px; min-height: 400px; border-top: 2px solid gray; border-left: 2px solid gray; background-color: white; padding: 10px">
			<h1 style="font-size: 18px">XP Paint Overview</h1>
			<p>
				XP Paint is a fork of the JS Paint application. It has a different goal than JS Paint in that
				it is intended to be fully usable offline and as close to the origional XP version of paint
				as possible. It removes some features from JS Paint to keep it lighter and available to use
				offline, and, unlike JS Paint, XP Paint is contained within a single HTML file, making it
				highly portable and very easy to embed within web tech. Since it is a single HTML file, you
				can actually save this webpage and you'll have a complete copy of XP Paint available.
			</p>

			<p>
				Currently this page does not actually contain all of the origional help functionality of
				the Paint within Windows XP, since the help topics are barely used and there is a lot of
				work involved in making a copy of them, but if someone wants to port all the text over
				and the functionality, then by all means do a pull request and I'll add in a credit
				for you!
			</p>
		</div>
	</div>
	`;

	const $fieldset = $(E("div"))
		.appendTo($w.$main);

	$w.$content.attr("style", "margin: 0px; padding: 0px; padding-left: 3px; padding-right: 3px");
	
	$fieldset.append(aboutWindowBody);

	addTabFunctionality();
}