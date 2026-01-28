from flask import Blueprint, render_template, current_app

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    # We pass the version info to the HTML
    return render_template('index.html', 
                           version=current_app.config['LATEST_VERSION'],
                           win_file=current_app.config['INSTALLER_WIN'],
                           linux_file=current_app.config['INSTALLER_LINUX'],
                           mac_file=current_app.config['INSTALLER_MAC'])

@bp.route('/docs')
def docs():
    return render_template('docs.html')