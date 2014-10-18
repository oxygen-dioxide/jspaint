
var $menus = $(E("div")).addClass("jspaint-menus").prependTo($V);
var selecting_menus = false;

$.each(menus, function(menu_key, menu_items){
	var _html = function(menu_key){
		return menu_key.replace(/&(.)/, function(m){
			return "<span class='jspaint-menu-hotkey'>" + m[1] + "</span>";
		});
	};
	var _hotkey = function(menu_key){
		return menu_key[menu_key.indexOf("&")+1].toUpperCase();
	};
	var this_click_opened_the_menu = false;
	var $menu_container = $(E("div")).addClass("jspaint-menu-container").appendTo($menus);
	var $menu_button = $(E("div")).addClass("jspaint-menu-button").appendTo($menu_container);
	var $menu_popup = $(E("div")).addClass("jspaint-menu-popup").appendTo($menu_container);
	var $menu_popup_table = $(E("table")).addClass("jspaint-menu-popup-table").appendTo($menu_popup);
	$menu_popup.hide();
	$menu_button.html(_html(menu_key));
	$menu_button.on("mousedown mousemove", function(e){
		if(e.type === "mousemove" && !selecting_menus){
			return;
		}
		if(e.type === "mousedown"){
			if(!$menu_button.hasClass("active")){
				this_click_opened_the_menu = true;
			}
		}
		
		$menus.find(".jspaint-menu-button").trigger("release");
		
		$menu_button.addClass("active");
		$menu_popup.show();
		
		selecting_menus = true;
	});
	$menu_button.on("mouseup", function(e){
		if(this_click_opened_the_menu){
			this_click_opened_the_menu = false;
			return;
		}
		if($menu_button.hasClass("active")){
			$menus.find(".jspaint-menu-button").trigger("release");
		}
	});
	$menu_button.on("release", function(e){
		selecting_menus = false;
		
		$menu_button.removeClass("active");
		$menu_popup.hide();
	});
	$.map(menu_items, function(item){
		var $row = $(E("tr")).addClass("jspaint-menu-row").appendTo($menu_popup_table)
		if(item === ____________________________){
			var $td = $(E("td")).attr({colspan: 4}).appendTo($row);
			var $hr = $(E("hr")).addClass("jspaint-menu-hr").appendTo($td);
		}else{
			var $item = $row.addClass("jspaint-menu-item");
			var $checkbox_area = $(E("td")).addClass("jspaint-menu-item-checkbox-area");
			var $label = $(E("td")).addClass("jspaint-menu-item-label");
			var $shortcut = $(E("td")).addClass("jspaint-menu-item-shortcut");
			var $submenu_area = $(E("td")).addClass("jspaint-menu-item-submenu-area");
			
			$item.append($checkbox_area, $label, $shortcut, $submenu_area);
			
			$label.html(_html(item.item));
			$shortcut.text(item.shortcut);
			
			$item.attr("disabled", item.disabled);
			
			if(item.checkbox){
				$checkbox_area.text("✓");
			}
			
			if(item.submenu){
				$submenu_area.text("▶");
				var open_tid, close_tid;
				$item.on("mouseover", function(){
					if(open_tid){clearTimeout(open_tid);}
					if(close_tid){clearTimeout(close_tid);}
					open_tid = setTimeout(function(){
						$submenu_area.text("▽");
					}, 200);
				});
				$item.on("mouseout", function(){
					if(open_tid){clearTimeout(open_tid);}
					if(close_tid){clearTimeout(close_tid);}
					open_tid = setTimeout(function(){
						$submenu_area.text("▶");
					}, 200);
				});
			}
			
			$item.on("click", function(){
				if(item.checkbox){
					if(item.checkbox.toggle){
						var check = item.checkbox.toggle();
						$checkbox_area.text(check ? "✓" : "");
					}
				}else if(item.action){
					$menus.find(".jspaint-menu-button").trigger("release");
					item.action();
				}
			});
		}
	});
});
$(window).on("keypress blur", function(e){
	$menus.find(".jspaint-menu-button").trigger("release");
});
$(window).on("mousedown mouseup", function(e){
	if(!$.contains($menus.get(0), e.target)){
		$menus.find(".jspaint-menu-button").trigger("release");
	}
});