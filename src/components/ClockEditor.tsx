import { useEffect, useState } from 'react';
import 'fabric';
declare const fabric: any;

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

const ClockEditor: React.FC = () => {
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
  }, [color, showNumbers, fontSize, selectedFont, showCenterDot, lineWidth, lineLength, roundedEdges, innerPosition, isEditable]);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = (format: string) => {
    const canvas = document.getElementById('clock-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const size = usePixels ? clockSize : clockSize * 37.8;
    const scale = size / 500;

    // Create a temporary canvas for export
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;

    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    // Draw the original canvas scaled to the new size
    ctx.scale(scale, scale);
    ctx.drawImage(canvas, 0, 0);

    // Convert to the requested format
    let extension = 'png', mimeType = 'image/png';
    switch (format) {
      case 'image/jpeg':
        extension = 'jpg';
        mimeType = 'image/jpeg';
        break;
      case 'image/svg+xml':
        extension = 'svg';
        mimeType = 'image/svg+xml';
        break;
    }

    // Get the data URL
    const dataUrl = tempCanvas.toDataURL(mimeType, 1.0);

    // Download the image
    const link = document.createElement('a');
    link.download = `clock.${extension}`;
    link.href = dataUrl;
    link.type = mimeType;
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
            <MenuItem onClick={() => handleExport('image/png')}>PNG</MenuItem>
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
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>פונט</InputLabel>
                  <Select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    label="פונט"
                  >
                    <MenuItem value="Assistant">Assistant</MenuItem>
                    <MenuItem value="Arial">Arial</MenuItem>
                    <MenuItem value="Helvetica">Helvetica</MenuItem>
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
