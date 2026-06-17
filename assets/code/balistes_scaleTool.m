function balistes_scale()
% BALISTES_SCALE  Laser-dot scaling tool for benthic transect photos.
%
% Avelina Axonov — Wake Forest University (Luthy Lab)

    clc;
    has_ipt = license('test', 'Image_Toolbox');

    hdr('BALISTES LASER SCALING TOOL');
    fprintf('  Avelina Axonov  ·  Wake Forest University  ·  2026\n');
    fprintf('  Benthic transect image scaling & annotation tool\n\n');
    if ~has_ipt
        note('Image Processing Toolbox not found — manual mode only.');
    end

    % ── housing parameters ────────────────────────────────────────────────
    params = inputdlg( ...
        {'Laser pointer spacing on housing (mm):', ...
         'Housing depth (m) — leave 0 if unknown:'}, ...
        'Housing Parameters', 1, {'100', '0'});

    if isempty(params), fprintf('Cancelled.\n'); return; end

    d_lasers = str2double(params{1});
    depth_m  = str2double(params{2});

    if isnan(d_lasers) || d_lasers <= 0
        errordlg('Laser spacing must be a positive number.'); return;
    end
    if isnan(depth_m) || depth_m < 0
        errordlg('Depth must be 0 or a positive number (use 0 if unknown).'); return;
    end

    results = {};

    % ── MAIN LOOP ─────────────────────────────────────────────────────────
    while true

        % ── load image ────────────────────────────────────────────────────
        [file, path] = uigetfile( ...
            {'*.jpg;*.jpeg;*.png;*.tif;*.tiff','Image files'}, ...
            'Select transect photo');

        if isequal(file, 0)
            sep(); note('No file selected — exiting.'); break;
        end

        img = imread(fullfile(path, file));

        bold_line(['FILE: ' file]);

        % ── duplicate check (shown after filename for context) ────────────
        if ~isempty(results)
            prior_files = results(:, 1);
            prior_files = prior_files(~cellfun(@isempty, prior_files));
            if any(strcmp(prior_files, file))
                dup = questdlg( ...
                    ['"' file '" was already measured this session. Measure again?'], ...
                    'Duplicate Photo', ...
                    'Yes — measure again', 'Skip this photo', 'Yes — measure again');
                if ~strcmp(dup, 'Yes — measure again') || isempty(dup)
                    note(['Skipping duplicate: ' file]);
                    continue;
                end
                warn_line('Proceeding with duplicate photo.');
            end
        end

        section('LASER DOTS');

        photo_comment = '';   % filled after measurements

        fig = figure('Name', ['Balistes  |  ' file], 'NumberTitle', 'off');
        imshow(img); hold on;

        % ── find laser dots ───────────────────────────────────────────────
        if has_ipt
            ok_line('Trying auto-detection of green laser dots...');
            [dot1, dot2, method] = find_laser_dots_ipt(img);
        else
            method = 'manual';
        end

        if strcmp(method, 'auto')
            h1 = plot(dot1(1), dot1(2), 'g+', 'MarkerSize', 22, 'LineWidth', 2.5);
            h2 = plot(dot2(1), dot2(2), 'g+', 'MarkerSize', 22, 'LineWidth', 2.5);
            title('Auto-detected dots (green +)  —  Accept or click manually?', ...
                'FontSize', 10);
            drawnow;
            choice = questdlg('Accept auto-detected laser dot positions?', ...
                'Confirm dots', 'Yes', 'No — click manually', 'Yes');
            if ~strcmp(choice, 'Yes')
                delete(h1); delete(h2);
                method = 'manual';
            end
        end

        if strcmp(method, 'manual')
            while true   % allow redo of dot placement
                title('Click LASER DOT 1', 'FontSize', 12, 'Color', [0.7 0.5 0]);
                note('Click laser dot 1...');
                try
                    p = ginput(1);
                catch
                    note('Figure closed.'); close(fig); return;
                end
                dot1 = p(1,:);
                done_note('Dot 1 placed');
                hd1 = plot(dot1(1), dot1(2), 'yo', 'MarkerSize', 12, ...
                    'LineWidth', 2.5, 'MarkerFaceColor', 'none');

                title('Click LASER DOT 2', 'FontSize', 12, 'Color', [0.7 0.5 0]);
                note('Click laser dot 2...');
                try
                    p = ginput(1);
                catch
                    note('Figure closed.'); close(fig); return;
                end
                dot2 = p(1,:);
                done_note('Dot 2 placed');
                hd2 = plot(dot2(1), dot2(2), 'yo', 'MarkerSize', 12, ...
                    'LineWidth', 2.5, 'MarkerFaceColor', 'none');
                hd_line = plot([dot1(1) dot2(1)], [dot1(2) dot2(2)], ...
                    'y--', 'LineWidth', 1.2);

                title('Dots placed — keep or redo?', 'FontSize', 11);
                redo = questdlg('Happy with dot placement?', 'Confirm dots', ...
                    'Yes — looks good', 'Redo dots', 'Yes — looks good');
                if strcmp(redo, 'Yes — looks good') || isempty(redo)
                    break;
                end
                delete(hd1); delete(hd2); delete(hd_line);
            end
        end

        % ── scale factor ──────────────────────────────────────────────────
        px_dist   = sqrt((dot2(1)-dot1(1))^2 + (dot2(2)-dot1(2))^2);
        mm_per_px = d_lasers / px_dist;

        line([dot1(1) dot2(1)], [dot1(2) dot2(2)], ...
            'Color', 'cyan', 'LineWidth', 1.5, 'LineStyle', '--');

        section('SCALE');
        ok_line(sprintf('Dot method    : %s', method));
        ok_line(sprintf('Scale factor  : %.4f mm / px', mm_per_px));
        if depth_m > 0
            ok_line(sprintf('Housing depth : %.2f m', depth_m));
        else
            warn_line('Housing depth : unknown — logged as 0 in CSV');
        end
        section('MEASUREMENTS');

        % ── measure organisms ─────────────────────────────────────────────
        is_first_on_this_file = true;
        cont = 'Measure another organism';
        meas_count = 0;
        first_row_idx = size(results,1) + 1;  % first row index for this photo

        while true
            title('Click START of measurement', 'FontSize', 12, 'Color', 'k');

            ok_meas(sprintf('Measurement #%d', size(results,1)+1));
            note('Click start point...');
            try
                p = ginput(1);
            catch
                cont = 'Done'; break;
            end
            pt1 = p(1,:);
            done_note('Point 1 placed');
            hm1 = plot(pt1(1), pt1(2), 'wo', 'MarkerSize', 10, ...
                'LineWidth', 2, 'MarkerFaceColor', [1 0.2 0.8]);

            title('Click END of measurement', 'FontSize', 12, 'Color', 'k');
            note('Click end point...');
            try
                p = ginput(1);
            catch
                delete(hm1); cont = 'Done'; break;
            end
            pt2 = p(1,:);
            done_note('Point 2 placed');
            hm2 = plot(pt2(1), pt2(2), 'wo', 'MarkerSize', 10, ...
                'LineWidth', 2, 'MarkerFaceColor', [1 0.2 0.8]);

            org_px = sqrt((pt2(1)-pt1(1))^2 + (pt2(2)-pt1(2))^2);
            org_mm = org_px * mm_per_px;

            hm_line = line([pt1(1) pt2(1)], [pt1(2) pt2(2)], ...
                'Color', [1 0.2 0.8], 'LineWidth', 2);
            % mm value at pt2 end, label at pt1 end — always separated
            hm_txt = text(pt2(1)+75, pt2(2)-100, sprintf('%.1f mm', org_mm), ...
                'Color', [1 0.2 0.8], 'FontSize', 11, 'FontWeight', 'bold', ...
                'BackgroundColor', [0 0 0 0.42]);

            meas_count = meas_count + 1;
            title(sprintf('%.1f mm — keep or redo?', org_mm), 'FontSize', 11);
            keep = questdlg(sprintf('Result: %.1f mm — keep this measurement?', org_mm), ...
                'Confirm measurement', 'Keep', 'Redo', 'Done', 'Keep');

            if strcmp(keep, 'Redo')
                delete(hm1); delete(hm2); delete(hm_line); delete(hm_txt);
                note('Redoing measurement...');
                continue;
            end

            if strcmp(keep, 'Done') || isempty(keep)
                % still save with a default label so nothing is lost
                file_col = ''; comment_col = '';
                if is_first_on_this_file
                    file_col = file; comment_col = photo_comment;
                    is_first_on_this_file = false;
                end
                auto_label = sprintf('unlabeled_%d', size(results,1)+1);
                results(end+1, :) = {file_col, comment_col, depth_m, ...
                    d_lasers, mm_per_px, auto_label, org_mm, method}; %#ok<AGROW>
                text(pt1(1)+75, pt1(2)-100, auto_label, ...
                    'Color', [1 0.9 0], 'FontSize', 9, 'FontAngle', 'italic', ...
                    'BackgroundColor', [0 0 0 0.42]);
                warn_line(sprintf('Saved as "%s"  (%.1f mm)', auto_label, org_mm));
                cont = 'Done with this photo'; break;
            end

            % ── label ─────────────────────────────────────────────────────
            lbl = inputdlg( ...
                'Label (e.g. "sea cucumber site 3") — Cancel to skip:', ...
                'Label', 1, {''});
            if ~isempty(lbl) && ~isempty(lbl{1})
                label_str = lbl{1};
            else
                label_str = sprintf('unlabeled_%d', size(results,1)+1);
                warn_line(['No label entered — saved as "' label_str '"']);
            end
            text(pt1(1)+75, pt1(2)-100, label_str, ...
                'Color', [1 0.9 0], 'FontSize', 9, 'FontAngle', 'italic', ...
                'BackgroundColor', [0 0 0 0.42]);
            ok_meas(['Label : ' label_str]);

            % filename blank for subsequent rows from same file
            file_col = ''; comment_col = '';
            if is_first_on_this_file
                file_col = file; comment_col = photo_comment;
                is_first_on_this_file = false;
            end

            results(end+1, :) = {file_col, comment_col, depth_m, ...
                d_lasers, mm_per_px, label_str, org_mm, method}; %#ok<AGROW>

            cont = questdlg('Next?', 'Continue', ...
                'Measure another', 'Done with this photo', 'Quit', ...
                'Measure another');
            if ~strcmp(cont, 'Measure another'), break; end
        end

        if meas_count > 0
            ok_line(sprintf('Total on this photo: %d measurement(s)', meas_count));
        end
        % ── photo-level comment (once, after all measurements) ──────────
        cmt = inputdlg( ...
            'Photo comment (e.g. "visibility low", "surge", "camera tilted") — OK to skip:', ...
            ['Comment for: ' file], 1, {''});
        if ~isempty(cmt) && ~isempty(cmt{1})
            photo_comment = cmt{1};
            ok_line(['Photo comment : ' photo_comment]);
            % patch into the first row for this photo (rows were saved before comment was entered)
            if first_row_idx <= size(results,1)
                results{first_row_idx, 2} = photo_comment;
            end
        end

        % ── optional: save annotated photo ───────────────────────────────
        save_ann = questdlg('Save annotated version of this photo?', ...
            'Save Annotated', 'Yes', 'No', 'No');
        if strcmp(save_ann, 'Yes')
            [~, fname_only, fext] = fileparts(file);
            out_img = fullfile(path, [fname_only '_annotated' fext]);
            if depth_m > 0
                depth_str = sprintf('%.1f m', depth_m);
            else
                depth_str = 'unknown';
            end
            title(sprintf('%s  |  depth: %s', file, depth_str), ...
                'FontSize', 9, 'Color', 'k', 'Interpreter', 'none');
            drawnow;
            try
                exportgraphics(gca, out_img, 'Resolution', 150);
                ok_line(['Annotated photo saved: ' out_img]);
            catch
                try
                    saveas(fig, out_img);
                    ok_line(['Annotated photo saved: ' out_img]);
                catch
                    warn_line('Could not save annotated photo (try MATLAB R2020a+ for exportgraphics).');
                end
            end
        end

        try, close(fig); catch, end
        if strcmp(cont, 'Quit') || isempty(cont), break; end

        % "Done with this photo" → ask about next
        next_action = questdlg('What next?', 'Next step', ...
            'Load another photo', 'Quit', 'Load another photo');
        if ~strcmp(next_action, 'Load another photo') || isempty(next_action), break; end

        while true
            new_d = inputdlg('Housing depth for next photo (m):', ...
                'Update depth', 1, {num2str(depth_m)});
            if isempty(new_d), break; end   % cancelled — keep previous value
            val = str2double(new_d{1});
            if isnan(val) || val < 0
                errordlg('Depth must be 0 or a positive number. Try again.');
            else
                depth_m = val; break;
            end
        end
    end

    % ── save results ──────────────────────────────────────────────────────
    fprintf('\n  %s\n', repmat('=', 1, 52));
    if ~isempty(results)
        T = cell2table(results, 'VariableNames', ...
            {'filename','photo_comment','depth_m','laser_spacing_mm', ...
             'scale_mm_per_px','label','length_mm','dot_method'});
        out_csv = fullfile(path, 'balistes_measurements.csv');
        saved = false;
        try
            writetable(T, out_csv);
            saved = true;
        catch err
            warn_line('Could not write to default location (file may be open in Excel).');
            note(['Error: ' err.message]);
            warn_line('Choose an alternate save location:');
            [alt_file, alt_path] = uiputfile('*.csv', ...
                'Save measurements as...', 'balistes_measurements.csv');
            if ~isequal(alt_file, 0)
                out_csv = fullfile(alt_path, alt_file);
                try
                    writetable(T, out_csv);
                    saved = true;
                catch err2
                    warn_line(['Still could not save: ' err2.message]);
                end
            else
                warn_line('Save cancelled — data NOT written to disk.');
            end
        end
        section('RESULTS SUMMARY');
        ok_line(sprintf('Total measurements : %d', height(T)));
        if saved
            ok_line(['CSV saved to : ' out_csv]);
        else
            warn_line('CSV was NOT saved. Copy the table below manually if needed.');
        end
        sep();
        disp(T);
    else
        note('No measurements recorded.');
    end
    sep();
    bold_line('DONE.');
end


% ── IPT auto-detection ────────────────────────────────────────────────────
function [dot1, dot2, method] = find_laser_dots_ipt(img)
    try
        hsv = rgb2hsv(img);
        green_mask = (hsv(:,:,1) > 0.22) & (hsv(:,:,1) < 0.42) & ...
                     (hsv(:,:,2) > 0.45) & (hsv(:,:,3) > 0.55);
        green_mask = bwareaopen(green_mask, 8);
        stats = regionprops(green_mask, 'Centroid', 'Area');
        if length(stats) >= 2
            [~, idx] = sort([stats.Area], 'descend');
            dot1 = stats(idx(1)).Centroid;
            dot2 = stats(idx(2)).Centroid;
            method = 'auto';
        else
            dot1 = [0 0]; dot2 = [0 0]; method = 'manual';
        end
    catch
        dot1 = [0 0]; dot2 = [0 0]; method = 'manual';
    end
end


% ── Formatting helpers ────────────────────────────────────────────────────
function sep()
    fprintf('\n  %s\n', repmat('-', 1, 52));
end
function hdr(txt)
    stars = repmat('=', 1, 56);
    pad = max(0, floor((56 - length(txt)) / 2));
    fprintf('\n  %s\n', stars);
    fprintf('  %s%s\n', repmat(' ', 1, pad), txt);
    fprintf('  %s\n\n', stars);
end
function bold_line(txt)
    fprintf('\n  >>  %s\n', upper(txt));
end
function section(txt)
    fprintf('\n  --- %s %s\n', txt, repmat('-', 1, max(1, 44-length(txt))));
end
function ok_line(txt)
    % photo-level results (scale, total, comment, save path)
    fprintf('  [+]  %s\n', txt);
end
function ok_meas(txt)
    % measurement-level results (mm value, label)
    fprintf('      [+]  %s\n', txt);
end
function note(txt)
    % step instructions
    fprintf('            ~  %s\n', txt);
end
function done_note(txt)
    % feedback/confirmation — indented one level past instruction
    fprintf('                %s  %s\n', char(10003), txt);
end
function warn_line(txt)
    % warnings (same level as measurement results)
    fprintf('      [!]  %s\n', txt);
end
