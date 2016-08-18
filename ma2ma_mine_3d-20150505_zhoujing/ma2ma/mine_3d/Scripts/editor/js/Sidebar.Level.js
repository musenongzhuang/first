Sidebar.Level = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.CollapsiblePanel();
//	container.setCollapsed( true );

	container.addStatic( new UI.Text( '选择图层' ) );
	container.add( new UI.Break() );

	// class

	var options = ['全部图层','矿井图层','矿体线圈','矿体实体','矿体块段','水文图层'];

	var levelTypeRow = new UI.Panel();
	var levelType = new UI.Select().setOptions( options ).setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( updateLevel );

    levelTypeRow.add( new UI.Text( '图层' ).setWidth( '90px' ) );
    levelTypeRow.add( levelType );

	container.add( levelTypeRow );

	if ( editor.config.getKey( 'level' ) !== undefined ) {

        levelType.setValue( editor.config.getKey( 'renderer' ) );

	}

	//

	function updateLevel() {
        editor.select( null );
		signals.levelChanged.dispatch( levelType.getValue() );
		editor.config.setKey( 'level', levelType.getValue() );

	}

	return container;

}
