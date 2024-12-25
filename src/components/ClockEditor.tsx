import { useEffect, useRef, useState } from 'react';
import 'fabric';
declare const fabric: any;

import {
  AppBar,
  Box,
  Container,
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
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const EXPORT_FORMATS = [
  { label: 'PNG (שקוף)', value: 'image/png' },
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'SVG', value: 'image/svg+xml' }
];

const FONTS = [
  'Assistant',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New'
];

interface ClockSettings {
  size: number;
  sizeUnit: 'cm' | 'px';
  fontSize: number;
  lineWidth: number;
  lineLength: number;
  fontFamily: string;
  color: string;
  useNumbers: boolean;
  innerPosition: number;
  roundedEdges: boolean;
  showCenterDot: boolean;
  backgroundImage: string | null;
}

const ClockEditor: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [clockSize, setClockSize] = useState(30);
  const [usePixels, setUsePixels] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
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

  // קבוע לגודל התצוגה המקדימה
  const PREVIEW_SIZE = 500;

  // פונקציה להמרת צבע hex לערכי RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // פונקציה לחישוב צבע ניגודי
  const getContrastColor = (hexColor: string): string => {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return '#ffffff';
    
    // חישוב בהירות הצבע
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    
    // החזרת צבע ניגודי בהתאם לבהירות
    return brightness > 128 ? '#000000' : '#ffffff';
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

    // Add numbers or lines
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = 200 * innerPosition;
      const x = 250 + radius * Math.cos(angle);
      const y = 250 + radius * Math.sin(angle);

      if (showNumbers) {
        const number = new fabric.Text(i.toString(), {
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
        const lineEnd = roundedEdges ? 'round' : 'butt';
        
        const line = new fabric.Line([
          250 + (radius - lineLength / 2) * Math.cos(angle),
          250 + (radius - lineLength / 2) * Math.sin(angle),
          250 + (radius + lineLength / 2) * Math.cos(angle),
          250 + (radius + lineLength / 2) * Math.sin(angle)
        ], {
          stroke: color,
          strokeWidth: lineWidth,
          strokeLineCap: lineStart as any,
          strokeLineEnd: lineEnd as any,
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

    // Store canvas instance
    canvas.fabric = fabricCanvas;

    return () => {
      fabricCanvas.dispose();
    };
  }, [color, showNumbers, fontSize, selectedFont, showCenterDot, lineWidth, lineLength, roundedEdges, innerPosition, isEditable]);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = (format: string) => {
    const canvas = document.getElementById('clock-canvas') as HTMLCanvasElement;
    if (!canvas.fabric) return;

    const fabricCanvas = canvas.fabric as fabric.Canvas;
    
    // Set export size
    const size = usePixels ? clockSize : clockSize * 37.8;
    
    // Create a temporary canvas for export
    const tempCanvas = document.createElement('canvas');
    const tempFabric = new fabric.Canvas(tempCanvas, {
      width: size,
      height: size,
      backgroundColor: format === 'image/jpeg' ? '#FFFFFF' : 'transparent'
    });

    // Clone and scale objects
    const scale = size / 500;
    fabricCanvas.getObjects().forEach(obj => {
      const clone = fabric.util.object.clone(obj);
      clone.scaleX = (clone.scaleX || 1) * scale;
      clone.scaleY = (clone.scaleY || 1) * scale;
      clone.left = (clone.left || 0) * scale;
      clone.top = (clone.top || 0) * scale;
      tempFabric.add(clone);
    });

    tempFabric.renderAll();

    // Generate data URL and download
    let extension, mimeType;
    switch (format) {
      case 'image/png':
        extension = 'png';
        mimeType = 'image/png';
        break;
      case 'image/jpeg':
        extension = 'jpg';
        mimeType = 'image/jpeg';
        break;
      case 'image/svg+xml':
        extension = 'svg';
        mimeType = 'image/svg+xml';
        break;
      default:
        return;
    }

    let dataUrl;
    if (format === 'image/svg+xml') {
      const svg = tempFabric.toSVG();
      dataUrl = `data:${mimeType};charset=utf-8,${encodeURIComponent(svg)}`;
    } else {
      dataUrl = tempFabric.toDataURL({
        format: format === 'image/png' ? 'png' : 'jpeg',
        quality: 1
      });
    }

    // Download
    const link = document.createElement('a');
    link.download = `clock.${extension}`;
    link.href = dataUrl;
    link.type = mimeType;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    tempFabric.dispose();
    handleExportClose();
  };

  const a11yProps = (index: number) => {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
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
            {EXPORT_FORMATS.map((format) => (
              <MenuItem
                key={format.value}
                onClick={() => handleExport(format.value)}
              >
                {format.label}
              </MenuItem>
            ))}
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
            <Tab label="בסיסי" {...a11yProps(0)} />
            <Tab label="מתקדם" {...a11yProps(1)} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
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

              <FormControlLabel
                control={
                  <Switch
                    checked={showNumbers}
                    onChange={(e) => setShowNumbers(e.target.checked)}
                  />
                }
                label="השתמש במספרים"
              />

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
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>פונט</InputLabel>
                <Select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  label="פונט"
                >
                  {FONTS.map(font => (
                    <MenuItem key={font} value={font}>{font}</MenuItem>
                  ))}
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

              {!showNumbers && (
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
                  max={95}
                />
              </Box>
            </Stack>
          </TabPanel>
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
