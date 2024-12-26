import { useEffect, useState } from 'react';
import 'fabric';
declare const fabric: any;

type MarkType = 'numbers' | 'letters' | 'lines';

import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Switch,
  FormControlLabel,
  Menu,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  ListSubheader,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const ClockEditor: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [clockSize, setClockSize] = useState(30);
  const [usePixels, setUsePixels] = useState(false);
  const [markType, setMarkType] = useState<MarkType>('numbers');
  const [showCenterDot, setShowCenterDot] = useState(true);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [color, setColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);
  const [lineWidth, setLineWidth] = useState(2);
  const [lineLength, setLineLength] = useState(20);
  const [roundedEdges, setRoundedEdges] = useState(false);
  const [innerPosition, setInnerPosition] = useState(0.8);
  const [selectedFont, setSelectedFont] = useState('Assistant');
  const [isEditable, setIsEditable] = useState(true);

  const hebrewLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'];

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

  const fonts = [
    // קטגוריה: פונטים עבריים מודרניים
    { name: 'Assistant', displayName: 'אסיסטנט', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Heebo', displayName: 'חיבו', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Rubik', displayName: 'רוביק', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Secular One', displayName: 'סקולר', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Suez One', displayName: 'סואץ', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Varela Round', displayName: 'ורלה', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Alef', displayName: 'אלף', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    
    // קטגוריה: פונטים עבריים קלאסיים
    { name: 'David Libre', displayName: 'דוד', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Frank Ruhl Libre', displayName: 'פרנק', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Miriam Libre', displayName: 'מרים', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Tinos', displayName: 'טינוס', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Noto Sans Hebrew', displayName: 'נוטו', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Open Sans Hebrew', displayName: 'אופן סנס', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    
    // קטגוריה: פונטים עבריים מיוחדים
    { name: 'Amatic SC', displayName: 'אמטיק', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Karantina', displayName: 'קרנטינה', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    { name: 'Bellefair', displayName: 'בלפייר', displayText: { numbers: '123', letters: 'אבג' }, category: 'hebrew', supportsHebrew: true },
    
    // קטגוריה: פונטים דקורטיביים למספרים
    { name: 'Abril Fatface', displayName: 'אבריל', displayText: { numbers: '123', letters: '123' }, category: 'decorative', supportsHebrew: false },
    { name: 'Alfa Slab One', displayName: 'אלפא', displayText: { numbers: '123', letters: '123' }, category: 'decorative', supportsHebrew: false },
    { name: 'Bungee', displayName: 'בנג׳י', displayText: { numbers: '123', letters: '123' }, category: 'decorative', supportsHebrew: false },
    { name: 'Bungee Shade', displayName: 'בנג׳י צל', displayText: { numbers: '123', letters: '123' }, category: 'decorative', supportsHebrew: false },
    { name: 'Comfortaa', displayName: 'קומפורטה', displayText: { numbers: '123', letters: '123' }, category: 'decorative', supportsHebrew: false },
    { name: 'Righteous', displayName: 'רייצ׳ס', displayText: { numbers: '123', letters: '123' }, category: 'decorative', supportsHebrew: false },
    { name: 'Rubik Mono One', displayName: 'רוביק מונו', displayText: { numbers: '123', letters: '123' }, category: 'decorative', supportsHebrew: false },
    { name: 'Russo One', displayName: 'רוסו', displayText: { numbers: '123', letters: '123' }, category: 'decorative', supportsHebrew: false },
    
    // קטגוריה: פונטים אמנותיים למספרים
    { name: 'Codystar', displayName: 'קודיסטאר', displayText: { numbers: '123', letters: '123' }, category: 'artistic', supportsHebrew: false },
    { name: 'Creepster', displayName: 'קריפסטר', displayText: { numbers: '123', letters: '123' }, category: 'artistic', supportsHebrew: false },
    { name: 'Fascinate', displayName: 'פאסינייט', displayText: { numbers: '123', letters: '123' }, category: 'artistic', supportsHebrew: false },
    { name: 'Lobster', displayName: 'לובסטר', displayText: { numbers: '123', letters: '123' }, category: 'artistic', supportsHebrew: false },
    { name: 'Monoton', displayName: 'מונוטון', displayText: { numbers: '123', letters: '123' }, category: 'artistic', supportsHebrew: false },
    { name: 'Pacifico', displayName: 'פסיפיקו', displayText: { numbers: '123', letters: '123' }, category: 'artistic', supportsHebrew: false },
    { name: 'Permanent Marker', displayName: 'מרקר', displayText: { numbers: '123', letters: '123' }, category: 'artistic', supportsHebrew: false },
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

  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);

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
      const radius = 200 * innerPosition;
      const x = 250 + radius * Math.cos(angle);
      const y = 250 + radius * Math.sin(angle);

      if (markType === 'numbers' || markType === 'letters') {
        const text = markType === 'numbers' ? i.toString() : hebrewLetters[i - 1];
        const number = new fabric.Text(text, {
          left: x,
          top: y,
          fontSize: fontSize,
          fontFamily: selectedFont,
          fill: color,
          originX: 'center',
          originY: 'center',
          selectable: isEditable
        });
        fabricCanvas.add(number);
      } else {
        const lineStart = roundedEdges ? 'round' : 'butt';
        const line = new fabric.Line([
          250 + (radius - lineLength / 2) * Math.cos(angle),
          250 + (radius - lineLength / 2) * Math.sin(angle),
          250 + (radius + lineLength / 2) * Math.cos(angle),
          250 + (radius + lineLength / 2) * Math.sin(angle)
        ], {
          stroke: color,
          strokeWidth: lineWidth,
          strokeLineCap: lineStart as any,
          selectable: isEditable
        });
        fabricCanvas.add(line);
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
  }, [color, markType, fontSize, selectedFont, showCenterDot, lineWidth, lineLength, roundedEdges, innerPosition, isEditable]);

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

    // Save current canvas state
    const originalState = {
      width: fabricCanvas.width,
      height: fabricCanvas.height,
      backgroundColor: fabricCanvas.backgroundColor,
      objects: fabricCanvas.getObjects().map(obj => ({
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
        left: obj.left || 0,
        top: obj.top || 0
      }))
    };

    // Prepare canvas for export
    fabricCanvas.setDimensions({
      width: sizeInPixels,
      height: sizeInPixels
    });

    // Calculate positions relative to new size
    fabricCanvas.getObjects().forEach((obj, index) => {
      const originalScale = originalState.objects[index];
      
      // Calculate relative position (-0.5 to 0.5)
      const relativeX = ((originalScale.left || 0) - 250) / 500;
      const relativeY = ((originalScale.top || 0) - 250) / 500;
      
      // Calculate new scale based on original size (500x500)
      const newScale = sizeInPixels / 500;
      
      // Apply new position and scale
      obj.set({
        left: sizeInPixels / 2 + relativeX * sizeInPixels,
        top: sizeInPixels / 2 + relativeY * sizeInPixels,
        scaleX: newScale,
        scaleY: newScale
      });
    });

    // Set background based on format and render
    fabricCanvas.backgroundColor = format === 'image/jpeg' ? '#FFFFFF' : '';
    fabricCanvas.renderAll();

    // Export based on format
    let dataUrl;
    if (format === 'image/svg+xml') {
      dataUrl = fabricCanvas.toSVG();
    } else {
      dataUrl = fabricCanvas.toDataURL({
        format: format === 'image/png' ? 'png' : 'jpeg',
        quality: 1,
        enableRetinaScaling: false // Disable retina scaling to get exact pixel size
      });
    }

    // Restore canvas state
    fabricCanvas.setDimensions({
      width: originalState.width || 500,
      height: originalState.height || 500
    });

    // Restore all objects to original scale and position
    fabricCanvas.getObjects().forEach((obj, index) => {
      const originalScale = originalState.objects[index];
      obj.set({
        scaleX: originalScale.scaleX,
        scaleY: originalScale.scaleY,
        left: originalScale.left,
        top: originalScale.top
      });
    });

    fabricCanvas.backgroundColor = originalState.backgroundColor || '';
    fabricCanvas.renderAll();

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
          <Tooltip title={isEditable ? 'נעל עריכה' : 'אפשר עריכה'}>
            <IconButton color="inherit" onClick={() => setIsEditable(!isEditable)}>
              {isEditable ? <LockOpenIcon /> : <LockIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="הורד תמונה">
            <IconButton color="inherit" onClick={handleExportClick}>
              <SaveIcon />
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
                    <MenuItem value="lines">קווים</MenuItem>
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

                {(markType === 'numbers' || markType === 'letters') && (
                  <>
                    <FormControl fullWidth>
                      <InputLabel>פונט</InputLabel>
                      <Select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        label="פונט"
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
                                  {markType === 'numbers' || font.category !== 'hebrew' ? 
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

                {markType === 'lines' && (
                  <>
                    <Box>
                      <Typography gutterBottom>עובי קו</Typography>
                      <Slider
                        value={lineWidth}
                        onChange={(_, value) => setLineWidth(value as number)}
                        min={1}
                        max={10}
                      />
                    </Box>
                    <Box>
                      <Typography gutterBottom>אורך קו</Typography>
                      <Slider
                        value={lineLength}
                        onChange={(_, value) => setLineLength(value as number)}
                        min={10}
                        max={50}
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

                <Box>
                  <Typography gutterBottom>מרחק מהמרכז</Typography>
                  <Slider
                    value={innerPosition * 100}
                    onChange={(_, value) => setInnerPosition((value as number) / 100)}
                    min={50}
                    max={90}
                  />
                </Box>
              </Stack>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography>הגדרות מתקדמות יתווספו בקרוב...</Typography>
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
};

export default ClockEditor;