/**
 * Created by yatou on 2015/2/13.
 */
Siderbar.Measure = function( editor){
    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setCollapsed( true );

    container.addStatic( new UI.Text( '测量' ) );
    container.add( new UI.Break() );

    var buttons = new UI.Panel();

    var params = new UI.Panel();


    container.add( buttons );
    container.add( params );
    var add_measure = new UI.Button( '测量' ).onClick( onAddMeasueClick );
    buttons.add( add_measure );

}