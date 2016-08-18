var Sidebar = function ( editor ) {

	var container = new UI.Panel();

    container.add( new Sidebar.Test( editor ) );
    container.add( new Sidebar.Menu( editor ) );
    container.add( new Sidebar.AreaAndUnit(editor) );
    container.add( new Sidebar.Block( editor ) );
	container.add( new Sidebar.Level( editor ) );
	container.add( new Sidebar.Scene( editor ) );
//	container.add( new Sidebar.Object3D( editor ) );
    container.add( new Sidebar.Operation( editor ) );


	return container;

}
