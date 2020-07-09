(()=> {

const looksLikeChrome = !!(window.chrome && (chrome.loadTimes || chrome.csi));
// NOTE: Microsoft Edge includes window.chrome.app
// (also this browser detection logic could likely use some more nuance)

window.menus = {
	"&File": [
		{
			item: "&New",
			shortcut: "Ctrl+Alt+N", // Ctrl+N opens a new browser window
			speech_recognition: [],
			action: ()=> { file_new(); },
			description: "Creates a new document.",
		},
		{
			item: "&Open",
			shortcut: "Ctrl+O",
			speech_recognition: [],
			action: ()=> { file_open(); },
			description: "Opens an existing document.",
		},
		{
			item: "&Save",
			shortcut: "Ctrl+S",
			speech_recognition: [],
			action: ()=> { file_save(); },
			description: "Saves the active document.",
		},
		{
			item: "Save &As",
			shortcut: "Ctrl+Shift+S",
			speech_recognition: [],
			// in mspaint, no shortcut is listed; it supports F12 (but in a browser that opens the dev tools)
			// it doesn't support Ctrl+Shift+S but that's a good & common modern shortcut
			action: ()=> { file_save_as(); },
			description: "Saves the active document with a new name.",
		},
		MENU_DIVIDER,
		{
			item: "Print Pre&view",
			speech_recognition: [],
			action: ()=> {
				print();
			},
			description: "Prints the active document and sets printing options.",
			//description: "Displays full pages.",
		},
		{
			item: "Page Se&tup",
			speech_recognition: [],
			action: ()=> {
				print();
			},
			description: "Prints the active document and sets printing options.",
			//description: "Changes the page layout.",
		},
		{
			item: "&Print",
			shortcut: "Ctrl+P",
			speech_recognition: [],
			action: ()=> {
				print();
			},
			description: "Prints the active document and sets printing options.",
		},
		MENU_DIVIDER,
		{
			item: "Set As &Wallpaper (Tiled)",
			speech_recognition: [],
			action: ()=> { set_as_wallpaper_tiled(); },
			description: "Tiles this bitmap as the desktop background.",
		},
		{
			item: "Set As Wallpaper (&Centered)", // in mspaint it's Wa&llpaper
			speech_recognition: [],
			action: ()=> { set_as_wallpaper_centered(); },
			description: "Centers this bitmap as the desktop background.",
		},
		MENU_DIVIDER,
		{
			item: "Recent File",
			enabled: false, // @TODO for desktop app
			description: "",
		},
		MENU_DIVIDER,
		{
			item: "E&xit",
			// shortcut: "Alt+F4", // closes browser window
			speech_recognition: [],
			action: ()=> {
				close();
			},
			description: "Quits Paint.",
		}
	],
	"&Edit": [
		{
			item: "&Undo",
			shortcut: "Ctrl+Z",
			speech_recognition: [],
			enabled: () => undos.length >= 1,
			action: ()=> { undo(); },
			description: "Undoes the last action.",
		},
		{
			item: "&Repeat",
			shortcut: "F4",
			speech_recognition: [],
			enabled: () => redos.length >= 1,
			action: ()=> { redo(); },
			description: "Redoes the previously undone action.",
		},
		{
			item: "&History",
			shortcut: "Ctrl+Shift+Y",
			speech_recognition: [],
			action: ()=> { show_document_history(); },
			description: "Shows the document history and lets you navigate to states not accessible with Undo or Repeat.",
		},
		MENU_DIVIDER,
		{
			item: "Cu&t",
			shortcut: "Ctrl+X",
			speech_recognition: [],
			enabled: () =>
				// @TODO: support cutting text with this menu item as well (e.g. for the text tool)
				!!selection,
			action: ()=> {
				edit_cut(true);
			},
			description: "Cuts the selection and puts it on the Clipboard.",
		},
		{
			item: "&Copy",
			shortcut: "Ctrl+C",
			speech_recognition: [],
			enabled: () =>
				// @TODO: support copying text with this menu item as well (e.g. for the text tool)
				!!selection,
			action: ()=> {
				edit_copy(true);
			},
			description: "Copies the selection and puts it on the Clipboard.",
		},
		{
			item: "&Paste",
			shortcut: "Ctrl+V",
			speech_recognition: [],
			enabled: () =>
				// @TODO: disable if nothing in clipboard or wrong type (if we can access that)
				true,
			action: ()=> {
				edit_paste(true);
			},
			description: "Inserts the contents of the Clipboard.",
		},
		{
			item: "C&lear Selection",
			shortcut: "Del",
			speech_recognition: [],
			enabled: () => !!selection,
			action: ()=> { delete_selection(); },
			description: "Deletes the selection.",
		},
		{
			item: "Select &All",
			shortcut: "Ctrl+A",
			speech_recognition: [],
			action: ()=> { select_all(); },
			description: "Selects everything.",
		},
		MENU_DIVIDER,
		{
			item: "C&opy To...",
			speech_recognition: [],
			enabled: () => !!selection,
			action: ()=> { save_selection_to_file(); },
			description: "Copies the selection to a file.",
		},
		{
			item: "Paste &From...",
			speech_recognition: [],
			action: ()=> { paste_from_file_select_dialog(); },
			description: "Pastes a file into the selection.",
		}
	],
	"&View": [
		{
			item: "&Tool Box",
			// shortcut: "Ctrl+T", // opens a new browser tab
			speech_recognition: [],
			checkbox: {
				toggle: ()=> {
					$toolbox.toggle();
				},
				check: () => $toolbox.is(":visible"),
			},
			description: "Shows or hides the tool box.",
		},
		{
			item: "&Color Box",
			// shortcut: "Ctrl+L", // focuses browser address bar
			speech_recognition: [],
			checkbox: {
				toggle: ()=> {
					$colorbox.toggle();
				},
				check: () => $colorbox.is(":visible"),
			},
			description: "Shows or hides the color box.",
		},
		{
			item: "&Status Bar",
			speech_recognition: [],
			checkbox: {
				toggle: ()=> {
					$status_area.toggle();
				},
				check: () => $status_area.is(":visible"),
			},
			description: "Shows or hides the status bar.",
		},
		{
			item: "T&ext Toolbar",
			speech_recognition: [],
			enabled: false, // @TODO: toggle fonts box
			checkbox: {},
			description: "Shows or hides the text toolbar.",
		},
		MENU_DIVIDER,
		{
			item: "&Zoom",
			submenu: [
				{
					item: "&Normal Size",
					// shortcut: "Ctrl+PgUp", // cycles thru browser tabs
					speech_recognition: [],
					description: "Zooms the picture to 100%.",
					enabled: () => magnification !== 1,
					action: ()=> {
						set_magnification(1);
					},
				},
				{
					item: "&Large Size",
					// shortcut: "Ctrl+PgDn", // cycles thru browser tabs
					speech_recognition: [],
					description: "Zooms the picture to 400%.",
					enabled: () => magnification !== 4,
					action: ()=> {
						set_magnification(4);
					},
				},
				{
					item: "Zoom To &Window",
					speech_recognition: [],
					description: "Zooms the picture to fit within the view.",
					action: ()=> {
						const rect = $canvas_area[0].getBoundingClientRect();
						const margin = 30; // leave a margin so scrollbars won't appear
						let mag = Math.min(
							(rect.width - margin) / canvas.width,
							(rect.height - margin) / canvas.height,
						);
						// round to an integer percent for the View > Zoom > Custom... dialog, which shows non-integers as invalid
						mag = Math.floor(100 * mag) / 100;
						set_magnification(mag);
					},
				},
				{
					item: "C&ustom...",
					description: "Zooms the picture.",
					speech_recognition: [],
					action: ()=> { show_custom_zoom_window(); },
				},
				MENU_DIVIDER,
				{
					item: "Show &Grid",
					shortcut: "Ctrl+G",
					speech_recognition: [],
					enabled: () => magnification >= 4,
					checkbox: {
						toggle: toggle_grid,
						check: () => show_grid,
					},
					description: "Shows or hides the grid.",
				},
				{
					item: "Show T&humbnail",
					speech_recognition: [],
					enabled: false, // @TODO: implement Show Thumbnail
					checkbox: {},
					description: "Shows or hides the thumbnail view of the picture.",
				}
			]
		},
		{
			item: "&View Bitmap",
			shortcut: "Ctrl+F",
			speech_recognition: [],
			action: ()=> { view_bitmap(); },
			description: "Displays the entire picture.",
		}
	],
	"&Image": [
		// @TODO: speech recognition: terms that apply to selection
		{
			item: "&Flip/Rotate",
			// shortcut: "Ctrl+R", // reloads browser tab
			speech_recognition: [],
			action: ()=> { image_flip_and_rotate(); },
			description: "Flips or rotates the picture or a selection.",
		},
		{
			item: "&Stretch/Skew",
			// shortcut: "Ctrl+W", // closes browser tab
			speech_recognition: [],
			action: ()=> { image_stretch_and_skew(); },
			description: "Stretches or skews the picture or a selection.",
		},
		{
			item: "&Invert Colors",
			shortcut: "Ctrl+I",
			speech_recognition: [],
			action: ()=> { image_invert_colors(); },
			description: "Inverts the colors of the picture or a selection.",
		},
		{
			item: "&Attributes...",
			shortcut: "Ctrl+E",
			speech_recognition: [],
			action: ()=> { image_attributes(); },
			description: "Changes the attributes of the picture.",
		},
		{
			item: "&Clear Image",
			shortcut: looksLikeChrome ? undefined : "Ctrl+Shift+N", // opens incognito window in chrome
			speech_recognition: [],
			// (mspaint says "Ctrl+Shft+N")
			action: ()=> { !selection && clear(); },
			enabled: ()=> !selection,
			description: "Clears the picture.",
			// action: ()=> {
			// 	if (selection) {
			// 		delete_selection();
			// 	} else {
			// 		clear();
			// 	}
			// },
			// mspaint says "Clears the picture or selection.", but grays out the option when there's a selection
		},
		{
			item: "&Draw Opaque",
			speech_recognition: [],
			checkbox: {
				toggle: ()=> {
					tool_transparent_mode = !tool_transparent_mode;
					$G.trigger("option-changed");
				},
				check: () => !tool_transparent_mode,
			},
			description: "Makes the current selection either opaque or transparent.",
		}
	],
	"&Colors": [
		{
			item: "&Edit Colors...",
			speech_recognition: [],
			action: ()=> {
				$colorbox.edit_last_color();
			},
			description: "Creates a new color.",
		},
		{
			item: "&Get Colors",
			speech_recognition: [],
			action: ()=> {
				get_FileList_from_file_select_dialog((files)=> {
					const file = files[0];
					Palette.load(file, (err, new_palette)=> {
						if(err){
							show_error_message("This file is not in a format that paint recognizes, or no colors were found.");
						}else{
							palette = new_palette;
							$colorbox.rebuild_palette();
						}
					});
				});
			},
			description: "Uses a previously saved palette of colors.",
		},
		{
			item: "&Save Colors",
			speech_recognition: [],
			action: ()=> {
				const blob = new Blob([JSON.stringify(palette)], {type: "application/json"});
				sanity_check_blob(blob, ()=> {
					saveAs(blob, "colors.json");
				});
			},
			description: "Saves the current palette of colors to a file.",
		}
	],
	"&Help": [
		{
			item: "&Help Topics",
			speech_recognition: [],
			action: ()=> { show_help(); },
			description: "Displays Help for the current task or command.",
		},
		MENU_DIVIDER,
		{
			item: "&About Paint",
			speech_recognition: [],
			action: ()=> { show_about_paint(); },
			description: "Displays information about this application.",
			//description: "Displays program information, version number, and copyright.",
		}
	],
	"E&xtras": [
		{
			item: "&History",
			shortcut: "Ctrl+Shift+Y",
			speech_recognition: [],
			action: ()=> { show_document_history(); },
			description: "Shows the document history and lets you navigate to states not accessible with Undo or Repeat.",
		},
		{
			item: "&Render History As GIF",
			shortcut: "Ctrl+Shift+G",
			speech_recognition: [],
			action: ()=> { render_history_as_gif(); },
			description: "Creates an animation from the document history.",
		},
		MENU_DIVIDER,
		{
			item: "Manage Storage",
			speech_recognition: [],
			action: ()=> { manage_storage(); },
			description: "Manages storage of previously created or opened pictures.",
		},
		MENU_DIVIDER,
		{
			item: "&Pride Color Palette",
			speech_recognition: [],
			action: ()=> {
				palette = ["#000000", "#784f17", "#fe0000", "#fd8c00", "#ffe500", "#119f0b", "#0644b3", "#c22edc", "#5adafd", "#febdd3", "#ffffff", "#febdd3", "#5adafd", "#d60270", "#000000", "#784f17", "#fe0000", "#fd8c00", "#ffe500", "#119f0b", "#0644b3", "#c22edc", "#5adafd", "#febdd3", "#ffffff", "#febdd3", "#5adafd", "#0038a8"];
				$colorbox.rebuild_palette();
			},
			description: "Pride flag color palette!",
		},
	],
};

})();
