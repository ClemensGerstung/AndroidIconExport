/////////////////////////////////////////////////////////////////
// The user is allowed to do anything with the licensed material. 
// Should the user of the product meet the author and consider the
// software useful, he is encouraged to buy the author a beer "in return" 
// (or, in some variations, to drink a beer in the author's honor).
/////////////////////////////////////////////////////////////////

// TODO: as Panel in PS

//--BEGIN CONSTANTS--\\

const mDoc = app.activeDocument;

const defRatioWH = mDoc.width / mDoc.height;
const defRatioHW = 1 / defRatioWH;

const width = 75;

const mdpiRatio = 1;
const hdpiRatio = mdpiRatio * 1.5;
const xhdpiRatio = mdpiRatio * 2;
const xxhdpiRatio = mdpiRatio * 3;

const mStartState = mDoc.activeHistoryState;

//--END CONSTANTS--\\

//--BEGIN METHODS--\\

function updateHeight(value, ratio) {
  mMDPIEditTextHeight.text = value * ratio * mdpiRatio;
  mHDPIEditTextHeight.text = value * ratio * hdpiRatio;
  mXHDPIEditTextHeight.text = value * ratio * xhdpiRatio;
  mXXHDPIEditTextHeight.text = value * ratio * xxhdpiRatio;  
}

function updateWidth(value, ratio) {
  mMDPIEditTextWidth.text = value * ratio * mdpiRatio;
  mHDPIEditTextWidth.text = value * ratio * hdpiRatio;
  mXHDPIEditTextWidth.text = value * ratio * xhdpiRatio;
  mXXHDPIEditTextWidth.text = value * ratio * xxhdpiRatio;
}

//--END METHODS--\\

//--BEGIN CALLBACKS--\\
function onMDPIWidthChanging() {
  var width = this.text / mdpiRatio;
  
  updateHeight(width, defRatioHW);
  
  updateWidth(width, 1);
}

function onHDPIWidthChanging() {
  var width = this.text / hdpiRatio;
  
  updateHeight(width, defRatioHW);
  
  updateWidth(width, 1);
}

function onXHDPIWidthChanging() {
  var width = this.text / xhdpiRatio;
  
  updateHeight(width, defRatioHW);
  
  updateWidth(width, 1);
}

function onXXHDPIWidthChanging() {
  var width = this.text / xxhdpiRatio;
  
  updateHeight(width, defRatioHW);
  
  updateWidth(width, 1);
}

function onMDPIHeightChanging() {
  var height = this.text / mdpiRatio;
  
  updateHeight(height, 1);
  
  updateWidth(height, defRatioWH);
}

function onHDPIHeightChanging() {
  var height = this.text / hdpiRatio;
  
  updateHeight(height, 1);
  
  updateWidth(height, defRatioWH);
}

function onXHDPIHeightChanging() {
  var height = this.text / xhdpiRatio;
  
  updateHeight(height, 1);
  
  updateWidth(height, defRatioWH);
}

function onXXHDPIHeightChanging() {
  var height = this.text / xxhdpiRatio;
  
  updateHeight(height, 1);
  
  updateWidth(height, defRatioWH);
}

function onSelectExportFolder() {
  var folder = Folder.selectDialog();
  mExportFolderEditText.text = folder.fsName;
}

function onExportImages() {
  if(mExportFolderEditText.text.length == 0) {
    alert("You have to select a path");
    return;
  }

  var prefix = mExportPrefixEditText.text;
  
  var imageName = mDoc.name.replace("psd", "png");
  
  var icons = [
    {"name": "mdpi", "width":mMDPIEditTextWidth.text, "height":mMDPIEditTextHeight.text},
    {"name": "hdpi", "width":mHDPIEditTextWidth.text, "height":mHDPIEditTextHeight.text},
    {"name": "xhdpi", "width":mXHDPIEditTextWidth.text, "height":mXHDPIEditTextHeight.text},
    {"name": "xxhdpi", "width":mXXHDPIEditTextWidth.text, "height":mXXHDPIEditTextHeight.text},
  ];  
  
  var sfw = new ExportOptionsSaveForWeb();
  sfw.format = SaveDocumentType.PNG;   
  sfw.PNG8 = false;
  sfw.transparency = true;  
  
  var icon;
  for (i = 0; i < icons.length; i++) 
  {
    icon = icons[i];
    var width = new UnitValue(icon.width, "px");
    var height = new UnitValue(icon.height, "px");
    
    var path;
    if(prefix.length != 0) {    
      path = mExportFolderEditText.text + "/" + prefix + "-" + icon.name;
    } else {
      path = mExportFolderEditText.text + "/" + icon.name;
    }
  
    var folderObj = new Folder(path);
    
    if(!folderObj.exists) {
      folderObj.create();  
    }
    
    mDoc.resizeImage(width, height, null, ResampleMethod.BICUBICSHARPER);
    
    mDoc.exportDocument(new File(folderObj.fsName + "/" + imageName), ExportType.SAVEFORWEB, sfw);
  }

  mDoc.activeHistoryState = mStartState; 
  alert("Export done");
  mWindow.close();
}

//-- END CALLBACKS--\\

//--BEGIN LAYOUT--\\

var mWindow = new Window('dialog', 'Export Android Image');  
mWindow.alignChildren = ['fill', 'fill'];

var mInputGroup = mWindow.add('panel', undefined, 'Dimension');
mInputGroup.orientation = 'column';
mInputGroup.alignChildren = 'right';

var mExportGroup = mWindow.add('panel', undefined, 'Export Options');
mExportGroup.orientation = 'column';
mExportGroup.alignChildren = 'fill';

var mButtonPanel = mWindow.add('group');
mButtonPanel.orientation = 'row';
mButtonPanel.alignChildren = 'fill';

var mMDPIGroup = mInputGroup.add('group');
mMDPIGroup.orientation = 'row';
mMDPIGroup.add('statictext', undefined, 'MDPI');

var mMDPIEditTextWidth = mMDPIGroup.add('edittext');
mMDPIEditTextWidth.size = [width, undefined];
mMDPIEditTextWidth.text = mDoc.width.value * mdpiRatio;

var mMDPIEditTextHeight = mMDPIGroup.add('edittext');
mMDPIEditTextHeight.size = [width, undefined];
mMDPIEditTextHeight.text = mDoc.height.value * mdpiRatio;

var mHDPIGroup = mInputGroup.add('group');
mHDPIGroup.orientation = 'row';
mHDPIGroup.add('statictext', undefined, 'HDPI');

var mHDPIEditTextWidth = mHDPIGroup.add('edittext');
mHDPIEditTextWidth.size = [width, undefined];
mHDPIEditTextWidth.text = mDoc.width.value * hdpiRatio;

var mHDPIEditTextHeight = mHDPIGroup.add('edittext');
mHDPIEditTextHeight.size = [width, undefined];
mHDPIEditTextHeight.text = mDoc.height.value * hdpiRatio;

var mXHDPIGroup = mInputGroup.add('group');
mXHDPIGroup.orientation = 'row';
mXHDPIGroup.add('statictext', undefined, 'XHDPI');

var mXHDPIEditTextWidth = mXHDPIGroup.add('edittext');
mXHDPIEditTextWidth.size = [width, undefined];
mXHDPIEditTextWidth.text = mDoc.width.value * xhdpiRatio;

var mXHDPIEditTextHeight = mXHDPIGroup.add('edittext');
mXHDPIEditTextHeight.size = [width, undefined];
mXHDPIEditTextHeight.text = mDoc.height.value * xhdpiRatio;

var mXXHDPIGroup = mInputGroup.add('group');
mXXHDPIGroup.orientation = 'row';
mXXHDPIGroup.add('statictext', undefined, 'XXHDPI');

var mXXHDPIEditTextWidth = mXXHDPIGroup.add('edittext');
mXXHDPIEditTextWidth.size = [width, undefined];
mXXHDPIEditTextWidth.text = mDoc.width.value * xxhdpiRatio;

var mXXHDPIEditTextHeight = mXXHDPIGroup.add('edittext');
mXXHDPIEditTextHeight.size = [width, undefined];
mXXHDPIEditTextHeight.text = mDoc.height.value * xxhdpiRatio;

var mExportFolderGroup = mExportGroup.add('group');
mExportFolderGroup.orientation = 'row';
mExportFolderGroup.alignChildren = ['fill', 'fill'];

var mExportFolderEditText = mExportFolderGroup.add('edittext');
mExportFolderEditText.enabled = false;

var mExportFolderButton = mExportFolderGroup.add('button', undefined, '...');
mExportFolderButton.maximumSize = [10, undefined];
mExportFolderButton.alignment = 'right';

var mExportPrefixGroup = mExportGroup.add('group');
mExportPrefixGroup.orientation = 'row';
mExportPrefixGroup.alignChildren = ['fill', 'fill'];

var mExportPrefixStaticText = mExportPrefixGroup.add('statictext', undefined, 'Folder prefix');
mExportPrefixStaticText.alignment = 'left';

var mExportPrefixEditText = mExportPrefixGroup.add('edittext');

var mExportButton = mButtonPanel.add("button", undefined, "Export");
var mCloseButton = mButtonPanel.add("button", undefined, "Close");

mMDPIEditTextWidth.onChanging = onMDPIWidthChanging;
mHDPIEditTextWidth.onChanging = onHDPIWidthChanging;
mXHDPIEditTextWidth.onChanging = onXHDPIWidthChanging;
mXXHDPIEditTextWidth.onChanging = onXXHDPIWidthChanging;

mMDPIEditTextHeight.onChanging = onMDPIHeightChanging;
mHDPIEditTextHeight.onChanging = onHDPIHeightChanging;
mXHDPIEditTextHeight.onChanging = onXHDPIHeightChanging;
mXXHDPIEditTextHeight.onChanging = onXXHDPIHeightChanging;

mExportFolderButton.onClick = onSelectExportFolder;
mExportButton.onClick = onExportImages;

mCloseButton.onClick = function() {
    mWindow.close();
}

mWindow.show();

//--END LAYOUT--\\
