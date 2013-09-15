document.addEvent('domready', function () {
    var tabPane = new TabPane('demo');

    $('demo').addEvent('click:relay(.remove)', function (e) {
        new Event(e).stop();
        var parent = this.getParent('.tab');
        var index = $('demo').getElements('.tab').indexOf(parent);
        tabPane.closeTab(index);
    });

    $('new-tab').addEvent('click', function () {
        var title = $('new-tab-title').get('value');
        var content = $('new-tab-content').get('value');

        if (!title || !content) {
            window.alert('Title or content text empty, please fill in some text.');
            return;
        }

        $('demo').getElement('ul').adopt(new Element('li', {
            'class': 'tab',
            text: title
        }).adopt(new Element('span', {
            'class': 'remove',
            html: '&times'
        })));
        $('demo').adopt(new Element('p', {
            'class': 'content',
            text: content
        }).setStyle('display', 'none'));
    });
});