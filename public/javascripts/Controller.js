var Controller = function() {
    window.onkeydown = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        switch(key) {
            case 37:
                if (!(0 > localPlayer.getX() - 5)) {
                    localPlayer.setX(localPlayer.getX() - 5);
                }
                break;
            case 38:
                if (!(0 > localPlayer.getY() - 5)) {
                    localPlayer.setY(localPlayer.getY() - 5);
                }
                break;
            case 39:
                if (!(playerCanvas.width < localPlayer.getX() + 5)) {
                    localPlayer.setX(localPlayer.getX() + 5);
                }
                break;
            case 40:
                if (!(playerCanvas.height < localPlayer.getY() + 5)) {
                    localPlayer.setX(localPlayer.getY() + 5);
                }

                break;
        }
    };
};