import {Card, Typography, Chip, Avatar, Button, TableCell, withStyles} from "@material-ui/core";


export const CherryRedTextTypography = withStyles({
  root: {
    color: "#f31a4c",
  }
})(Typography);

export const RedTextTypography = withStyles({
  root: {
    color: "#ef0e42",
  }
})(Typography);

export const BlueTextTypography = withStyles({
  root: {
    color: "#2e83f1",
  }
})(Typography);

export const WhiteTextTypography = withStyles({
  root: {
    color: "#d2cfcf",
  }
})(Typography);

export const BrownCard = withStyles({
  root: {
    backgroundColor: "#442424",
    padding: 10,
  }
})(Card);

export const NameChip = withStyles({
  root: {
    backgroundColor: "#4A3838BF",
    fontSize:22,
    color: "#f31a4c",
  }
})(Chip);

export const RedScoreCounter = withStyles({
  root: {
    backgroundColor: "#ef0e42",
  }
})(Avatar);

export const BlueScoreCounter = withStyles({
  root: {
    backgroundColor: "#0e77ef",
  }
})(Avatar);

export const RedRollButton = withStyles({
  root: {
    color:"#ffffff",
    backgroundColor: "#ef0e42",
  }
})(Button);

export const BlueRollButton = withStyles({
  root: {
    color:"#ffffff",
    backgroundColor: "#0e77ef",
  }
})(Button);

export const LeaderboardHeadingTableCell = withStyles({
  root: {
    fontSize:35,
    color:"#2e83f1",
  }
})(TableCell)

export const LeaderboardBlueTableCell = withStyles({
  root: {
    fontSize:17,
    color:"#2e83f1",
  }
})(TableCell)

export const LeaderboardWhiteTableCell = withStyles({
  root: {
    fontSize:17,
    color:"#ffffff",
  }
})(TableCell)
