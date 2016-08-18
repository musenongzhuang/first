Sidebar.Test = function ( editor ) {
    var meshCount = 0;
    //var addStatus = 0;
    var signals = editor.signals;
    var view = Toolbar.view;

    var container = new UI.CollapsiblePanel();
    container.setCollapsed( true );

    container.addStatic( new UI.Text( '加载对象' ) );
    container.add( new UI.Break() );

    var buttons = new UI.Panel();

    var params = new UI.Panel();


    container.add( buttons );
    container.add( params );

    var load_well = new UI.Button( '加载矿井' ).onClick( onAddWellClick );
    buttons.add( load_well );
    var load_well_detail = new UI.Button( '加载矿井细节' ).onClick( onAddWellDetailClick );
    buttons.add( load_well_detail );
    var load_lines = new UI.Button( '加载线圈' ).onClick( onAddLineClick );
    buttons.add( load_lines );
    var load_object = new UI.Button( '加载矿体' ).onClick( onAddObjectClick );
    buttons.add( load_object );


    function onAddWellClick () {
        editor.loadWell();
        //addStatus = 1;
        //view.setValue('true');

    }

    // configure menu contents
    function onAddWellDetailClick () {
        editor.loadDetailWell();
        //addStatus = 2;
    }

    function onAddLineClick () {
        editor.loadLine();
        //addStatus = 3;

    }

    function onAddObjectClick () {
        editor.loadObject();
       // addStatus = 4;
    }
    return container;

}
