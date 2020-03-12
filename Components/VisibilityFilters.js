import React from "react";
import cx from "classnames";
import { connect } from "react-redux";
import { setFilter } from "../Redux/actions";
import { VISIBILITY_FILTERS } from "../Redux/constants";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  filterActive: {
    background: 'linear-gradient(#3f51b5, #6696ff)',
  }
});

const VisibilityFilters = ({ activeFilter, setFilter }) => {
  const classes = useStyles();
  
  return (
    <div className={classes.filters}>
      <ButtonGroup aria-label="outlined primary button group">
        {Object.keys(VISIBILITY_FILTERS).map(filterKey => {
        const currentFilter = VISIBILITY_FILTERS[filterKey];
        return (
          <Button
            key={`visibility-filter-${currentFilter}`}
            className={cx(
              classes.filter,
              currentFilter === activeFilter && classes.filterActive
            )}
            color="inherit"
            onClick={() => {
              setFilter(currentFilter);
            }}
          >
            {currentFilter}
          </Button>
        );
        
      })}
      </ButtonGroup>
    </div>
  );
};

const mapStateToProps = state => {
  return { activeFilter: state.visibilityFilter };
};
// export default VisibilityFilters;
export default connect(
  mapStateToProps,
  { setFilter }
)(VisibilityFilters);
