import { useEffect, useState } from 'react';
import 'fabric';
declare const fabric: any;

type MarkType = 'numbers' | 'letters' | 'lines' | 'dots' | 'custom' | 'roman';
type CustomMarkType = 'none' | 'number' | 'letter' | 'line' | 'dot' | 'roman';

import {
  AppBar,
  Box,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  ListSubheader,
  Menu,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
  Tooltip
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MenuIcon from '@mui/icons-material/Menu';
import DownloadIcon from '@mui/icons-material/Download';

export default function ClockEditor() {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [clockSize, setClockSize] = useState(20);
  const [usePixels, setUsePixels] = useState(false);
  const [markType, setMarkType] = useState<MarkType>('numbers');
  const [color, setColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(24);
  const [showCenterDot, setShowCenterDot] = useState(true);
  const [lineWidth, setLineWidth] = useState(2);
  const [lineLength, setLineLength] = useState(20);
  const [roundedEdges, setRoundedEdges] = useState(false);
  const [innerPosition, _setInnerPosition] = useState(0.7);
  const [selectedFont, setSelectedFont] = useState('Assistant');
  const [isEditable, setIsEditable] = useState(true);
  const [whiteOutsideCircle, setWhiteOutsideCircle] = useState(false);
  const [customMarks, setCustomMarks] = useState<CustomMarkType[]>(Array(12).fill('number'));
  const [dotSize, setDotSize] = useState(3);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const hebrewLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'];
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getContrastColor = (hexColor: string): string => {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return '#ffffff';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const getMarkText = (index: number) => {
    switch (markType) {
      case 'numbers':
        return (index + 1).toString();
      case 'letters':
        return hebrewLetters[index];
      case 'roman':
        return romanNumerals[index];
      default:
        return '';
    }
  };

  const fonts = [
    // קטגוריה: פונטים עבריים מודרניים
    { name: 'Assistant', displayName: 'אסיסטנט', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Heebo', displayName: 'חיבו', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Rubik', displayName: 'רוביק', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Secular One', displayName: 'סקולר', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Suez One', displayName: 'סואץ', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Varela Round', displayName: 'ורלה', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Alef', displayName: 'אלף', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    
    // קטגוריה: פונטים עבריים קלאסיים
    { name: 'David Libre', displayName: 'דוד', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Frank Ruhl Libre', displayName: 'פרנק', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Miriam Libre', displayName: 'מרים', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Tinos', displayName: 'טינוס', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Noto Sans Hebrew', displayName: 'נוטו', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Open Sans Hebrew', displayName: 'אופן סנס', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    
    // קטגוריה: פונטים עבריים מיוחדים
    { name: 'Amatic SC', displayName: 'אמטיק', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Karantina', displayName: 'קרנטינה', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Bellefair', displayName: 'בלפייר', displayText: { numbers: '123', letters: 'אבג', roman: 'IVX' }, category: 'hebrew', supportsHebrew: true },
    
    // קטגוריה: פונטים דקורטיביים למספרים
    { name: 'Abril Fatface', displayName: 'אבריל', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'decorative', supportsHebrew: false },
    { name: 'Alfa Slab One', displayName: 'אלפא', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'decorative', supportsHebrew: false },
    { name: 'Bungee', displayName: 'בנג׳י', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'decorative', supportsHebrew: false },
    { name: 'Bungee Shade', displayName: 'בנג׳י צל', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'decorative', supportsHebrew: false },
    { name: 'Comfortaa', displayName: 'קומפורטה', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'decorative', supportsHebrew: false },
    { name: 'Righteous', displayName: 'רייצ׳ס', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'decorative', supportsHebrew: false },
    { name: 'Rubik Mono One', displayName: 'רוביק מונו', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'decorative', supportsHebrew: false },
    { name: 'Russo One', displayName: 'רוסו', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'decorative', supportsHebrew: false },
    
    // קטגוריה: פונטים אמנותיים למספרים
    { name: 'Codystar', displayName: 'קודיסטאר', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'artistic', supportsHebrew: false },
    { name: 'Creepster', displayName: 'קריפסטר', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'artistic', supportsHebrew: false },
    { name: 'Fascinate', displayName: 'פאסינייט', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'artistic', supportsHebrew: false },
    { name: 'Lobster', displayName: 'לובסטר', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'artistic', supportsHebrew: false },
    { name: 'Monoton', displayName: 'מונוטון', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'artistic', supportsHebrew: false },
    { name: 'Pacifico', displayName: 'פסיפיקו', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'artistic', supportsHebrew: false },
    { name: 'Permanent Marker', displayName: 'מרקר', displayText: { numbers: '123', letters: '123', roman: 'IVX' }, category: 'artistic', supportsHebrew: false },
  ];

  // מיון הפונטים לפי קטגוריות וסינון לפי תמיכה בעברית
  const getFilteredFonts = () => {
    const filteredFonts = markType === 'letters' ? fonts.filter(font => font.supportsHebrew) : fonts;
    return filteredFonts.reduce((groups: { [key: string]: typeof fonts }, font) => {
      const group = font.category;
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(font);
      return groups;
    }, {});
  };

  useEffect(() => {
    const canvas = document.getElementById('clock-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const fabricCanvas = new fabric.Canvas(canvas, {
      width: 500,
      height: 500,
      backgroundColor: getContrastColor(color),
      selection: isEditable
    });

    setFabricCanvas(fabricCanvas);

    // Create clock circle
    const circle = new fabric.Circle({
      radius: 240,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 2,
      left: 250,
      top: 250,
      originX: 'center',
      originY: 'center',
      selectable: false
    });
    fabricCanvas.add(circle);

    // Add numbers, lines or letters
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = 200 * innerPosition * 1.3;
      const x = 250 + radius * Math.cos(angle);
      const y = 250 + radius * Math.sin(angle);

      let element: fabric.Object | null = null;

      if (markType === 'custom') {
        const markType = customMarks[i - 1];
        switch (markType) {
          case 'number':
            element = new fabric.Text((i).toString(), {
              fontSize,
              fontFamily: selectedFont,
              fill: color,
              originX: 'center',
              originY: 'center',
              left: x,
              top: y
            });
            break;
          case 'letter':
            element = new fabric.Text(hebrewLetters[i - 1], {
              fontSize,
              fontFamily: selectedFont,
              fill: color,
              originX: 'center',
              originY: 'center',
              left: x,
              top: y
            });
            break;
          case 'roman':
            element = new fabric.Text(romanNumerals[i - 1], {
              fontSize,
              fontFamily: selectedFont,
              fill: color,
              originX: 'center',
              originY: 'center',
              angle: (i * 30) % 360,
              left: x,
              top: y
            });
            break;
          case 'line':
            const lineEndX = x + lineLength * Math.cos(angle);
            const lineEndY = y + lineLength * Math.sin(angle);
            element = new fabric.Line([x, y, lineEndX, lineEndY], {
              stroke: color,
              strokeWidth: lineWidth,
              strokeLineCap: roundedEdges ? 'round' : 'butt',
              originX: 'center',
              originY: 'center'
            });
            break;
          case 'dot':
            element = new fabric.Circle({
              radius: dotSize,
              fill: color,
              originX: 'center',
              originY: 'center'
            });
            break;
        }
      } else {
        switch (markType) {
          case 'numbers':
          case 'roman':
          case 'letters':
            element = new fabric.Text(getMarkText(i - 1), {
              fontSize,
              fontFamily: selectedFont,
              fill: color,
              originX: 'center',
              originY: 'center',
              angle: markType === 'roman' ? (i * 30) % 360 : 0,
              left: x,
              top: y
            });
            break;
          case 'lines':
            const lineEndX = x + lineLength * Math.cos(angle);
            const lineEndY = y + lineLength * Math.sin(angle);
            element = new fabric.Line([x, y, lineEndX, lineEndY], {
              stroke: color,
              strokeWidth: lineWidth,
              strokeLineCap: roundedEdges ? 'round' : 'butt',
              originX: 'center',
              originY: 'center'
            });
            break;
          case 'dots':
            element = new fabric.Circle({
              radius: dotSize,
              fill: color,
              originX: 'center',
              originY: 'center'
            });
            break;
        }
      }

      if (element) {
        element.set({
          left: x,
          top: y,
          selectable: isEditable
        });
        fabricCanvas.add(element);
      }
    }

    // Add center dot if enabled
    if (showCenterDot) {
      const dot = new fabric.Circle({
        radius: 5,
        fill: color,
        left: 250,
        top: 250,
        originX: 'center',
        originY: 'center',
        selectable: false
      });
      fabricCanvas.add(dot);
    }

    return () => {
      fabricCanvas.dispose();
    };
  }, [color, markType, fontSize, selectedFont, showCenterDot, lineWidth, lineLength, roundedEdges, innerPosition, isEditable, customMarks, dotSize]);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = (format: string) => {
    if (!fabricCanvas) return;

    // Convert size to pixels (1cm = 37.8 pixels)
    const sizeInPixels = Math.round(usePixels ? clockSize : clockSize * 37.8);
    console.log('Target size in pixels:', sizeInPixels);

    // Create a temporary canvas for export
    const tempCanvas = new fabric.Canvas(null, {
      width: sizeInPixels,
      height: sizeInPixels,
      backgroundColor: format === 'image/jpeg' ? '#FFFFFF' : ''
    });

    // Copy all objects from the original canvas
    fabricCanvas.getObjects().forEach((obj) => {
      const clonedObj = fabric.util.object.clone(obj);
      
      // Calculate relative position (-0.5 to 0.5)
      const relativeX = (obj.left! - 250) / 500;
      const relativeY = (obj.top! - 250) / 500;
      
      // Calculate new scale based on original size (500x500)
      const newScale = sizeInPixels / 500;
      
      // Apply new position and scale
      clonedObj.set({
        left: sizeInPixels / 2 + relativeX * sizeInPixels,
        top: sizeInPixels / 2 + relativeY * sizeInPixels,
        scaleX: newScale,
        scaleY: newScale
      });
      
      tempCanvas.add(clonedObj);
    });

    // If PNG and whiteOutsideCircle is enabled, create a mask
    if (format === 'image/png' && whiteOutsideCircle) {
      // Create a path that represents a white rectangle with a transparent circle
      const radius = sizeInPixels / 2;
      const center = sizeInPixels / 2;
      
      const path = new fabric.Path(
        `M 0 0
         L ${sizeInPixels} 0
         L ${sizeInPixels} ${sizeInPixels}
         L 0 ${sizeInPixels}
         Z
         M ${center} ${center}
         m -${radius}, 0
         a ${radius},${radius} 0 1,0 ${radius * 2},0
         a ${radius},${radius} 0 1,0 -${radius * 2},0`,
        {
          fill: '#FFFFFF',
          selectable: false,
          evented: false
        }
      );
      
      // Add the mask at the bottom
      tempCanvas.insertAt(path, 0);
    }

    tempCanvas.renderAll();

    // Export based on format
    let dataUrl;
    if (format === 'image/svg+xml') {
      dataUrl = tempCanvas.toSVG();
    } else {
      dataUrl = tempCanvas.toDataURL({
        format: format === 'image/png' ? 'png' : 'jpeg',
        quality: 1,
        enableRetinaScaling: false
      });
    }

    // Clean up
    tempCanvas.dispose();

    // Download the file
    const extension = format === 'image/png' ? 'png' : format === 'image/jpeg' ? 'jpg' : 'svg';
    const link = document.createElement('a');
    link.download = `clock.${extension}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    handleExportClose();
  };

  // Function to save settings
  const handleSaveSettings = () => {
    const settings = {
      markType,
      color,
      fontSize,
      lineWidth,
      lineLength,
      roundedEdges,
      innerPosition,
      selectedFont,
      isEditable,
      whiteOutsideCircle,
      customMarks,
      dotSize,
      showCenterDot
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clock-settings.imgc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Function to load settings
  const handleLoadSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        setMarkType(settings.markType);
        setColor(settings.color);
        setFontSize(settings.fontSize);
        setLineWidth(settings.lineWidth);
        setLineLength(settings.lineLength);
        setRoundedEdges(settings.roundedEdges);
        _setInnerPosition(settings.innerPosition);
        setSelectedFont(settings.selectedFont);
        setIsEditable(settings.isEditable);
        setWhiteOutsideCircle(settings.whiteOutsideCircle);
        setCustomMarks(settings.customMarks);
        setDotSize(settings.dotSize);
        setShowCenterDot(settings.showCenterDot);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            עורך שעון קיר
          </Typography>
          <Tooltip title="שמור הגדרות">
            <IconButton onClick={handleSaveSettings} sx={{ ml: 1, color: 'white' }}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          <input
            type="file"
            accept=".imgc"
            style={{ display: 'none' }}
            id="load-settings"
            onChange={handleLoadSettings}
          />
          <Tooltip title="טען הגדרות">
            <label htmlFor="load-settings">
              <IconButton component="span" sx={{ ml: 1, color: 'white' }}>
                <FileUploadIcon />
              </IconButton>
            </label>
          </Tooltip>
          <Tooltip title="נעל/שחרר עריכה">
            <IconButton
              onClick={() => setIsEditable(!isEditable)}
              sx={{ ml: 1, color: 'white' }}
            >
              {isEditable ? <LockOpenIcon /> : <LockIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="הורד תמונה">
            <IconButton onClick={handleExportClick} sx={{ ml: 1, color: 'white' }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={handleExportClose}
          >
            <MenuItem onClick={() => handleExport('image/png')}>PNG (שקוף)</MenuItem>
            <MenuItem onClick={() => handleExport('image/jpeg')}>JPEG</MenuItem>
            <MenuItem onClick={() => handleExport('image/svg+xml')}>SVG</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: 350,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 350,
            boxSizing: 'border-box',
            transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
            right: 'unset !important',
            left: 0,
            position: 'fixed',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            aria-label="הגדרות שעון"
          >
            <Tab label="בסיסי" />
            <Tab label="מתקדם" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography gutterBottom>
                    גודל השעון: {clockSize}{usePixels ? 'px' : 'ס"מ'}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Slider
                      value={clockSize}
                      onChange={(_, value) => setClockSize(value as number)}
                      min={usePixels ? 100 : 10}
                      max={usePixels ? 1000 : 100}
                      step={usePixels ? 10 : 1}
                    />
                    <ToggleButtonGroup
                      value={usePixels ? 'px' : 'cm'}
                      exclusive
                      onChange={(_, value) => value && setUsePixels(value === 'px')}
                      size="small"
                    >
                      <ToggleButton value="cm">ס"מ</ToggleButton>
                      <ToggleButton value="px">פיקסלים</ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Box>

                <FormControl fullWidth>
                  <InputLabel>סוג סימון</InputLabel>
                  <Select
                    value={markType}
                    onChange={(e) => setMarkType(e.target.value as MarkType)}
                    label="סוג סימון"
                  >
                    <MenuItem value="numbers">מספרים</MenuItem>
                    <MenuItem value="letters">אותיות עבריות</MenuItem>
                    <MenuItem value="roman">ספרות רומיות</MenuItem>
                    <MenuItem value="lines">קווים</MenuItem>
                    <MenuItem value="dots">נקודות</MenuItem>
                    <MenuItem value="custom">התאמה אישית</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={showCenterDot}
                      onChange={(e) => setShowCenterDot(e.target.checked)}
                    />
                  }
                  label="הצג נקודה מרכזית"
                />

                <TextField
                  fullWidth
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  label="צבע"
                />

                <Box>
                  <Typography gutterBottom>
                    מרחק מהמרכז
                  </Typography>
                  <Slider
                    value={innerPosition * 100}
                    onChange={(_, value) => _setInnerPosition((value as number) / 100)}
                    min={50}
                    max={99}
                  />
                </Box>

                {(markType === 'numbers' || markType === 'letters' || markType === 'roman' || 
                  (markType === 'custom' && customMarks.some(m => m === 'number' || m === 'letter' || m === 'roman'))) && (
                  <>
                    <FormControl fullWidth>
                      <InputLabel>גופן</InputLabel>
                      <Select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        label="גופן"
                      >
                        {Object.entries(getFilteredFonts()).map(([category, categoryFonts]) => [
                          <ListSubheader key={category} sx={{ bgcolor: 'background.paper', fontWeight: 'bold' }}>
                            {category === 'hebrew' ? 'פונטים עבריים' :
                             category === 'decorative' ? 'פונטים דקורטיביים' :
                             'פונטים אמנותיים'}
                          </ListSubheader>,
                          ...categoryFonts.map((font) => (
                            <MenuItem 
                              key={font.name} 
                              value={font.name}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <Typography>{font.displayName}</Typography>
                                <Typography sx={{ 
                                  fontFamily: `'${font.name}', sans-serif`,
                                  fontSize: '24px',
                                  minWidth: '60px',
                                  textAlign: 'left'
                                }}>
                                  {markType === 'roman' ? 'IVX' :
                                    markType === 'numbers' || font.category !== 'hebrew' ? 
                                    font.displayText.numbers : 
                                    font.displayText.letters}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))
                        ]).flat()}
                      </Select>
                    </FormControl>

                    <Box>
                      <Typography gutterBottom>גודל טקסט</Typography>
                      <Slider
                        value={fontSize}
                        onChange={(_, value) => setFontSize(value as number)}
                        min={12}
                        max={48}
                      />
                    </Box>
                  </>
                )}

                {(markType === 'lines' || 
                  (markType === 'custom' && customMarks.some(m => m === 'line'))) && (
                  <>
                    <Box>
                      <Typography gutterBottom>
                        {markType === 'lines' || (markType === 'custom' && customMarks.some(m => m === 'line')) ? 'אורך קו' : 'גודל נקודה'}
                      </Typography>
                      <Slider
                        value={markType === 'lines' || (markType === 'custom' && customMarks.some(m => m === 'line')) ? lineLength : dotSize}
                        onChange={(_, value) => markType === 'lines' || (markType === 'custom' && customMarks.some(m => m === 'line')) ? 
                          setLineLength(value as number) : setDotSize(value as number)}
                        min={markType === 'lines' || (markType === 'custom' && customMarks.some(m => m === 'line')) ? 10 : 2}
                        max={markType === 'lines' || (markType === 'custom' && customMarks.some(m => m === 'line')) ? 50 : 10}
                      />
                    </Box>
                    {(markType === 'lines' || (markType === 'custom' && customMarks.some(m => m === 'line'))) && (
                      <>
                        <Box>
                          <Typography gutterBottom>
                            עובי קו
                          </Typography>
                          <Slider
                            value={lineWidth}
                            onChange={(_, value) => setLineWidth(value as number)}
                            min={1}
                            max={10}
                          />
                        </Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={roundedEdges}
                              onChange={(e) => setRoundedEdges(e.target.checked)}
                            />
                          }
                          label="קצוות מעוגלים"
                        />
                      </>
                    )}
                  </>
                )}

                {(markType === 'dots' || 
                  (markType === 'custom' && customMarks.some(m => m === 'dot'))) && (
                  <Box>
                    <Typography gutterBottom>
                      {markType === 'dots' || (markType === 'custom' && customMarks.some(m => m === 'dot')) ? 'גודל נקודה' : 'גודל נקודה'}
                    </Typography>
                    <Slider
                      value={dotSize}
                      onChange={(_, value) => setDotSize(value as number)}
                      min={2}
                      max={10}
                    />
                  </Box>
                )}
              </Stack>
            </Box>
          )}

          {tabValue === 0 && markType === 'custom' && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                התאמה אישית
              </Typography>
              <Stack spacing={2}>
                {Array.from({ length: 12 }, (_, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ minWidth: 30 }}>{i + 1}</Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={customMarks[i]}
                        onChange={(e) => {
                          const newMarks = [...customMarks];
                          newMarks[i] = e.target.value as CustomMarkType;
                          setCustomMarks(newMarks);
                        }}
                      >
                        <MenuItem value="none">ללא</MenuItem>
                        <MenuItem value="number">מספר</MenuItem>
                        <MenuItem value="letter">אות עברית</MenuItem>
                        <MenuItem value="roman">ספרה רומית</MenuItem>
                        <MenuItem value="line">קו</MenuItem>
                        <MenuItem value="dot">נקודה</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                הגדרות מתקדם
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={whiteOutsideCircle}
                    onChange={(e) => setWhiteOutsideCircle(e.target.checked)}
                  />
                }
                label="רקע לבן מחוץ לשעון (PNG)"
              />
            </Box>
          )}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: drawerOpen ? '350px' : 0,
          transition: theme => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Paper
          elevation={3}
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: '#f5f5f5',
            minHeight: '500px',
            maxHeight: '90vh'
          }}
        >
          <canvas id="clock-canvas" style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto' }} />
        </Paper>
      </Box>
    </Box>
  );
}