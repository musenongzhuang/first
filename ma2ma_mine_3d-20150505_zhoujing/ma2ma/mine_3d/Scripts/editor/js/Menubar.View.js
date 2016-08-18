Menubar.View = function ( editor ) {
	
	var menuConfig,
		optionsPanel,
		createOption,
		createDivider;

	function onLightThemeOptionClick () {

	    editor.setTheme('../Styles/editor/light.css');
	    editor.config.setKey('theme', '../Styles/editor/light.css');

	}

	function onDarkThemeOptionClick () {

		editor.setTheme( '../Styles/editor/dark.css' );
		editor.config.setKey( 'theme', '../Styles/editor/dark.css' );

	}
	

	// configure menu contents

	createOption  = UI.MenubarHelper.createOption;
	createDivider = UI.MenubarHelper.createDivider;

	menuConfig    = [
		createOption( '灰色主题', onLightThemeOptionClick ),
		createOption( '黑色主题', onDarkThemeOptionClick )
	];

	optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

	return UI.MenubarHelper.createMenuContainer( '主题', optionsPanel );

}
